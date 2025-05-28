<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Sadece localhost'tan gelen isteklere izin vermek daha güvenli olabilir.
header('Access-Control-Allow-Headers: Content-Type');

// Güvenlik için: Sadece belirli domainlere istek atılmasına izin ver
$allowed_hosts = [
    'api.ondex.uk',
    'ip-api.com',
    'discordapp.com', // Nitro checker için
    'api.qrserver.com' // QR Code için
];

if (!isset($_GET['url'])) {
    echo json_encode(['error' => 'No URL provided', 'status' => 'failure']);
    exit;
}

$apiUrl = trim($_GET['url']);
$parsedUrl = parse_url($apiUrl);

if (!$parsedUrl || !isset($parsedUrl['scheme']) || !isset($parsedUrl['host'])) {
    echo json_encode(['error' => 'Invalid URL structure', 'url' => $apiUrl, 'status' => 'failure']);
    exit;
}

// Host kontrolü
if (!in_array($parsedUrl['host'], $allowed_hosts)) {
    echo json_encode(['error' => 'Access to this host is not allowed', 'host' => $parsedUrl['host'], 'status' => 'failure']);
    exit;
}

// HTTPS zorunluluğu (isteğe bağlı ama önerilir)
// if ($parsedUrl['scheme'] !== 'https') {
//     echo json_encode(['error' => 'Only HTTPS requests are allowed to external APIs', 'status' => 'failure']);
//     exit;
// }


$queryStringParams = [];
foreach ($_GET as $key => $value) {
    if ($key !== 'url') {
        $queryStringParams[$key] = $value;
    }
}

$finalUrl = $apiUrl;
if (!empty($queryStringParams)) {
    // Eğer orijinal URL'de zaten query string varsa & ile, yoksa ? ile ekle
    $finalUrl .= (strpos($apiUrl, '?') === false ? '?' : '&') . http_build_query($queryStringParams);
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $finalUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Yönlendirmeleri takip et
curl_setopt($ch, CURLOPT_TIMEOUT, 15); // 15 saniye timeout
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // SSL sertifika doğrulaması (güvenlik için önemli)
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

// Bazı API'ler User-Agent isteyebilir
curl_setopt($ch, CURLOPT_USERAGENT, 'CyberQueryPanel/5.0 (PHP-Proxy)');

// Debug için:
// curl_setopt($ch, CURLOPT_VERBOSE, true);
// $verbose = fopen('php://temp', 'w+');
// curl_setopt($ch, CURLOPT_STDERR, $verbose);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$curlError = curl_error($ch);

// Debug için:
// rewind($verbose);
// $verboseLog = stream_get_contents($verbose);
// fclose($verbose);
// error_log("cURL Verbose: " . $verboseLog);


if ($curlError) {
    // Network veya cURL seviyesinde hata
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(['error' => 'cURL Error: ' . $curlError, 'url' => $finalUrl, 'status' => 'failure']);
} elseif ($httpCode >= 400) {
    // API'den gelen hata kodu
    // Dönen içeriği de (genelde JSON olur) olduğu gibi iletmeye çalışalım
    header("HTTP/1.1 " . $httpCode); // İstemciye de aynı HTTP kodunu gönderelim
    // Yanıtın JSON olup olmadığını kontrol et
    json_decode($response);
    if (json_last_error() === JSON_ERROR_NONE) {
        // Eğer yanıt JSON ise, Content-Type'ı JSON yap ve yanıtı olduğu gibi gönder
        header('Content-Type: application/json');
        echo $response;
    } else {
        // JSON değilse, hata mesajını JSON formatında oluştur
        echo json_encode(['error' => 'API request failed', 'http_code' => $httpCode, 'response' => substr($response, 0, 200) . '...', 'url' => $finalUrl, 'status' => 'failure']);
    }
} else {
    // Başarılı yanıt
    if (strpos($contentType, 'application/json') !== false) {
        header('Content-Type: application/json');
    } elseif (strpos($contentType, 'image/') !== false) {
        // Eğer resim ise, content type'ı ayarla ve base64 olarak döndür (ya da doğrudan binary)
        // Şimdilik resimleri JSON içinde URL olarak döndürmeyi script.js hallediyor.
        // Eğer proxy'nin resim döndürmesi gerekiyorsa burası değişmeli.
        // header('Content-Type: ' . $contentType);
        // echo $response; // Bu durumda script.js tarafında blob olarak handle edilmeli.
        // Şimdilik JSON varsayalım
        header('Content-Type: application/json'); // Varsayılan
         echo json_encode(['data' => 'Resim gibi gorunuyor ama JSON olarak gonderildi', 'content_type' => $contentType]);

    } else {
         header('Content-Type: application/json'); // Varsayılan
    }
    echo $response; // API'den gelen yanıtı olduğu gibi bas
}

curl_close($ch);
?>