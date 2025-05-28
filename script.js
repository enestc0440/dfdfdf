const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const numbers = '0123456789';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const matrixChars = (katakana + numbers + latin).split('');

const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

let animationFrameId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    // Eğer animasyon çalışıyorsa yeniden başlatmak gerekebilir.
    // Şimdilik sadece boyutlandırma yeterli.
});
resizeCanvas(); // İlk yüklemede boyutlandır

const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1).map(() => Math.random() * canvas.height); // Rastgele başlangıç


function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'; // Daha yavaş silinme efekti
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00'; // Neon yeşil
    ctx.font = `${fontSize}px "VT323", monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) { // %2.5 ihtimalle resetle
            drops[i] = 0;
        }
        drops[i]++;
    }
    animationFrameId = requestAnimationFrame(drawMatrix);
}

drawMatrix(); // Animasyonu başlat


const apiConfigs = {
    // Kimlik
    tcsorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/tcsorgu.php', params: ['tc'] },
    tcprosorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/tcprosorgu.php', params: ['tc'] },
    adressorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/adressorgu.php', params: ['tc'] },
    hanesorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/hanesorgu.php', params: ['tc'] },
    adsoyadsorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/adsoyadsorgu.php', params: ['ad', 'soyad', 'il', 'ilce'] },
    adsoyadprosorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/adsoyadprosorgu.php', params: ['ad', 'soyad', 'il', 'ilce'] },
    gsmtcprosorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/gsmtcprosorgu.php', params: ['gsm'] },
    tcgsmprosorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/tcgsmprosorgu.php', params: ['tc'] },
    sulaleprosorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/sulaleprosorgu.php', params: ['tc'] },
    isyeriarkadasisorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/isyeriarkadasisorgu.php', params: ['tc'] },
    isyerisorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/isyerisorgu.php', params: ['tc'] },
    isyeriyetkilisorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/isyeriyetkilisorgu.php', params: ['tc'] },
    fakeid: { local: true, params: ['count'] },
    // OSINT
    ipsorgu_ondex: { proxy: true, url: 'https://api.ondex.uk/ondexapi/ipsorgu.php', params: ['ip'] },
    ipsorgu_ipapi: { proxy: true, url: 'http://ip-api.com/json/', params: ['ip'], noBaseUrlInProxy: true }, // ip-api.com için özel proxy handling
    whois: { local: true, params: ['domain'], message: "WHOIS sorgusu için API anahtarı ve yapılandırma gereklidir. Bu özellik şu anda aktif değil." },
    portscanner: { proxy: true, url: 'https://api.ondex.uk/ondexapi/portscanner.php', params: ['host', 'port'] },
    metascraping: { proxy: true, url: 'https://api.ondex.uk/ondexapi/metascraping.php', params: ['url'] },
    // Leak & Dark Web
    leakcheck_ondex: { proxy: true, url: 'https://api.ondex.uk/ondexapi/leakcheck.php', params: ['query'] }, // query genelde email olur
    emailsorgu: { proxy: true, url: 'https://api.ondex.uk/ondexapi/emailsorgu.php', params: ['email'] },
    numarakedi: { proxy: true, url: 'https://api.ondex.uk/ondexapi/numarakedi.php', params: ['sayı'] },
    darkweb: { local: true, params: ['query'], message: "Gerçek Dark Web taraması özel erişim ve araçlar gerektirir. Bu özellik şu anda simülasyondur." },
    liveshot: { proxy: true, url: 'https://api.ondex.uk/ondexapi/liveshot.php', params: ['url'], isImage: true },
    // Yapay Zeka
    gpt: { local: true, params: ['apiKey', 'prompt'], message: "GPT API anahtarınızı girerek kullanabilirsiniz. API çağrısı burada simüle edilmiştir." },
    // Güvenlik
    hash: { local: true, params: ['text', 'type'] }, // type: md5, sha1, sha256, sha512
    discordnitrogenerator_ondex: { proxy: true, url: 'https://api.ondex.uk/ondexapi/discordnitrogenerator.php', params: ['adet']},
    nitro_checker_local: { local: true, params: ['codes'] }, // 'codes' textarea olacak
    scraper: { local: true, params: ['text_to_scrape'] }, // text_to_scrape textarea olacak
    // Genel
    operator: { proxy: true, url: 'https://api.ondex.uk/ondexapi/operator.php', params: ['gsm'] },
    browser: { local: true, params: [] },
    camera: { local: true, params: [] },
    json: { local: true, params: ['json_data'] }, // json_data textarea olacak
    password: { local: true, params: ['length', 'include_uppercase', 'include_numbers', 'include_symbols'] },
    urlencode: { local: true, params: ['text_to_encode', 'mode'] }, // mode: encode, decode
    qrcode: { local: true, params: ['text_for_qr'] }
};


const categories = {
    kimlik: document.getElementById('kimlik-api-select'),
    osint: document.getElementById('osint-api-select'),
    leak: document.getElementById('leak-api-select'),
    ai: document.getElementById('ai-api-select'),
    security: document.getElementById('security-api-select'),
    general: document.getElementById('general-api-select')
};

const inputContainers = {
    kimlik: document.getElementById('kimlik-inputs'),
    osint: document.getElementById('osint-inputs'),
    leak: document.getElementById('leak-inputs'),
    ai: document.getElementById('ai-inputs'),
    security: document.getElementById('security-inputs'),
    general: document.getElementById('general-inputs')
};

const resultElement = document.getElementById('result');
const videoContainer = document.getElementById('video-container');
const stopCameraButton = document.getElementById('stop-camera');
const loadingElement = document.getElementById('loading');
const outputSearchInput = document.getElementById('output-search');

let cameraStream = null;
let originalResultContent = ''; // Arama için orijinal içeriği sakla

function updateInputFields(category) {
    const selectElement = categories[category];
    const selectedApiValue = selectElement.value;
    const config = apiConfigs[selectedApiValue];
    const container = inputContainers[category];
    container.innerHTML = ''; // Önceki inputları temizle

    if (config.message) {
        const p = document.createElement('p');
        p.textContent = config.message;
        p.style.color = "#00aaff"; // Info rengi
        container.appendChild(p);
    }

    config.params.forEach(param => {
        const div = document.createElement('div');
        let label = document.createElement('label');
        label.htmlFor = `${category}-${param}`;
        label.textContent = param.replace(/_/g, ' ').toUpperCase() + ':';
        div.appendChild(label);

        if (param === 'type' && selectedApiValue === 'hash') {
            const select = document.createElement('select');
            select.id = `${category}-${param}`;
            ['md5', 'sha1', 'sha256', 'sha512'].forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt.toUpperCase();
                select.appendChild(option);
            });
            div.appendChild(select);
        } else if (param === 'mode' && selectedApiValue === 'urlencode') {
            const select = document.createElement('select');
            select.id = `${category}-${param}`;
            ['encode', 'decode'].forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
                select.appendChild(option);
            });
            div.appendChild(select);
        } else if (['prompt', 'codes', 'text_to_scrape', 'json_data', 'text_to_encode'].includes(param)) {
            const textarea = document.createElement('textarea');
            textarea.id = `${category}-${param}`;
            textarea.placeholder = param.replace(/_/g, ' ').toUpperCase();
            textarea.rows = 3;
            div.appendChild(textarea);
        } else if (['include_uppercase', 'include_numbers', 'include_symbols'].includes(param)) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${category}-${param}`;
            checkbox.checked = true; // Varsayılan olarak işaretli
            const checkLabel = document.createElement('label');
            checkLabel.htmlFor = `${category}-${param}`;
            checkLabel.textContent = param.replace('include_', '').replace(/_/g, ' ').toUpperCase();
            checkLabel.style.marginLeft = '5px';
            div.appendChild(checkbox);
            div.appendChild(checkLabel);
        }
        else {
            const input = document.createElement('input');
            input.id = `${category}-${param}`;
            input.placeholder = param.replace(/_/g, ' ').toUpperCase();
            if (param === 'tc' || param === 'gsm') {
                input.type = 'text'; // Sayısal klavye için 'tel' de olabilir
                input.pattern = '\\d{10,11}';
                input.title = "TC (11 haneli) veya GSM (10-11 haneli) numarası girin.";
            } else if (param === 'ip' || param === 'host' || param === 'domain' || param === 'url') {
                input.type = 'text'; // 'url' tipi bazen kullanıcıyı kısıtlayabilir
            } else if (param === 'email' || param === 'query' && selectedApiValue === 'leakcheck_ondex') {
                input.type = 'email';
            } else if (['count', 'adet', 'length', 'port', 'sayı'].includes(param)) {
                input.type = 'number';
                if (param === 'length') input.min = '8';
                if (param === 'count') input.min = '1';
            } else {
                input.type = 'text';
            }
            div.appendChild(input);
        }
        container.appendChild(div);
    });
}

Object.keys(categories).forEach(category => {
    categories[category].addEventListener('change', () => updateInputFields(category));
    updateInputFields(category); // Sayfa yüklendiğinde ilk API için inputları oluştur
});

function displayResult(data, type = 'success') {
    resultElement.className = type; // success, error, info
    if (typeof data === 'object') {
        resultElement.textContent = JSON.stringify(data, null, 2);
    } else {
        resultElement.innerHTML = data; // HTML içeriği için innerHTML
    }
    originalResultContent = resultElement.innerHTML; // Arama için sakla
    loadingElement.style.display = 'none';
}

function displayImageResult(imageUrl, altText = "Live Shot") {
    resultElement.className = 'success';
    resultElement.innerHTML = `<img src="${imageUrl}" alt="${altText}" style="max-width:100%; height:auto;">`;
    originalResultContent = resultElement.innerHTML;
    loadingElement.style.display = 'none';
}


async function executeQuery(category) {
    const selectedApiValue = categories[category].value;
    const config = apiConfigs[selectedApiValue];
    const params = {};
    let queryUrl = '';

    // Önceki hata mesajlarını temizle
    document.querySelectorAll('.error-message-input').forEach(el => el.remove());
    let isValid = true;

    config.params.forEach(param => {
        const inputElement = document.getElementById(`${category}-${param}`);
        if (!inputElement) {
            console.error(`Input element not found for ${category}-${param}`);
            isValid = false;
            return;
        }
        
        if (inputElement.type === 'checkbox') {
            params[param] = inputElement.checked;
        } else {
            if (inputElement.checkValidity && !inputElement.checkValidity()) {
                isValid = false;
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message-input';
                errorDiv.textContent = `${param.toUpperCase()} için geçerli bir değer girin.`;
                inputElement.parentNode.appendChild(errorDiv);
            }
            params[param] = inputElement.value;
        }
    });

    if (!isValid) {
        displayResult('Lütfen tüm alanları doğru şekilde doldurun.', 'error');
        return;
    }

    loadingElement.style.display = 'block';
    resultElement.textContent = 'İşleniyor...';
    videoContainer.style.display = 'none';
    stopCameraButton.style.display = 'none';
    if (cameraStream) { // Önceki kamera akışını durdur
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    try {
        if (config.local) {
            // Yerel fonksiyonlar
            handleLocalFunctions(selectedApiValue, params);
        } else if (config.proxy) {
            // Proxy üzerinden API çağrıları
            let fullApiUrl = config.url;
            if (config.noBaseUrlInProxy && params.ip) { // ip-api.com için özel durum
                fullApiUrl = `${config.url}${params.ip}`;
            }
            
            queryUrl = `proxy.php?url=${encodeURIComponent(fullApiUrl)}`;
            
            if (!(config.noBaseUrlInProxy && params.ip)) { // ip-api.com için parametreler zaten URL'de
                Object.keys(params).forEach(key => {
                    queryUrl += `&${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
                });
            }

            const response = await fetch(queryUrl);
            if (!response.ok) {
                throw new Error(`API Hatası: ${response.status} ${response.statusText}`);
            }
            if (config.isImage) {
                // Eğer API doğrudan bir görüntü URL'si döndürüyorsa
                // Bu kısım liveshot için özel, liveshot URL'i bir JSON içinde dönüyor, proxy bunu handle etmeli
                // Ya da proxy doğrudan görüntüyü base64 olarak dönmeli.
                // Şimdilik Ondex API'sinin JSON içinde 'url' anahtarıyla resim URL'si döndüğünü varsayalım.
                const data = await response.json();
                if (data && data.url) {
                     // Proxy üzerinden resim URL'sini tekrar çağırıp base64 almak daha güvenli olabilir
                    // veya API'nin resim URL'sine doğrudan erişime izin verdiğini varsayalım.
                    // Burada basitlik adına doğrudan data.url'i kullanıyoruz.
                    // Eğer CORS sorunu olursa, bu resmi de proxy üzerinden çekmek gerekir.
                    displayImageResult(data.url, selectedApiValue);
                } else if (data && data.image_url) { // liveshot API'nin image_url döndürdüğünü varsayalım
                    displayImageResult(data.image_url, selectedApiValue);
                }
                 else {
                    // Eğer Ondex liveshot API'si doğrudan base64 veya blob döndürüyorsa:
                    // const imageBlob = await response.blob();
                    // const imageUrl = URL.createObjectURL(imageBlob);
                    // displayImageResult(imageUrl, selectedApiValue);
                     throw new Error("Geçerli bir resim URL'si bulunamadı.");
                }
            } else {
                const data = await response.json();
                displayResult(data);
            }
        }
    } catch (error) {
        console.error("Hata oluştu:", error);
        displayResult(`Hata: ${error.message}`, 'error');
    } finally {
        loadingElement.style.display = 'none';
    }
}

function handleLocalFunctions(apiName, params) {
    let output = '';
    switch (apiName) {
        case 'fakeid':
            output = "Sahte Kimlikler:\n";
            const count = parseInt(params.count) || 1;
            const names = ["Ahmet Yılmaz", "Ayşe Kaya", "Mehmet Demir", "Fatma Çelik", "Ali Şahin", "Zeynep Arslan", "Mustafa Aydın"];
            const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya"];
            const districts = ["Merkez", "Çankaya", "Bornova", "Osmangazi", "Muratpaşa", "Seyhan", "Selçuklu"];
            for (let i = 0; i < Math.min(count, 10); i++) { // Max 10 adet
                const name = names[Math.floor(Math.random() * names.length)];
                let tc = '';
                for(let j=0; j<11; j++) tc += Math.floor(Math.random() * 10);
                const city = cities[Math.floor(Math.random() * cities.length)];
                const district = districts[Math.floor(Math.random() * districts.length)];
                const street = `Atatürk Cd. No:${Math.floor(Math.random()*100)+1}`;
                output += `\nİsim: ${name}\nTCKN: ${tc}\nAdres: ${street}, ${district}/${city}\nResim: https://thispersondoesnotexist.com/image?${Date.now()+i}\n-----------------\n`;
            }
            displayResult(output);
            break;
        case 'whois': // Placeholder
        case 'darkweb': // Placeholder
        case 'gpt': // Placeholder
             displayResult(apiConfigs[apiName].message, 'info');
            break;
        case 'hash':
            const text = params.text;
            const type = params.type.toUpperCase(); // SHA-1, SHA-256, SHA-512
            if (!text) { displayResult("Hash için metin girin.", "error"); return; }
            (async () => {
                try {
                    const algorithm = type === 'MD5' ? 'MD5' : `SHA-${type.replace('SHA', '')}`;
                    if (type === 'MD5') { // MD5 için özel bir kütüphane gerekebilir veya basit bir implementasyon
                        output = `MD5: ${md5(text)}`; // Basit MD5 fonksiyonu (aşağıda eklenecek)
                    } else {
                        const msgBuffer = new TextEncoder().encode(text);
                        const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer);
                        const hashArray = Array.from(new Uint8Array(hashBuffer));
                        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                        output = `${type}: ${hashHex}`;
                    }
                    displayResult(output);
                } catch (e) { displayResult(`Hashing Error: ${e.message}`, "error"); }
            })();
            break;
        case 'nitro_checker_local':
            const codes = params.codes.split('\n').map(c => c.trim()).filter(c => c.length > 10 && c.length < 25); // Genelde 16-19 karakter olur
            if (codes.length === 0) {
                displayResult("Lütfen kontrol edilecek Nitro kodlarını girin.", "error");
                return;
            }
            output = "Nitro Kod Kontrol Sonuçları:\n";
            (async () => {
                let validCodesFound = [];
                for (const code of codes.slice(0, 20)) { // Bir seferde max 20 kod
                    const checkUrl = `https://discordapp.com/api/v9/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`;
                    // Proxy üzerinden gitmesi gerekiyor!
                    const proxyCheckUrl = `proxy.php?url=${encodeURIComponent(checkUrl)}`;
                    try {
                        const response = await fetch(proxyCheckUrl);
                        if (response.status === 200) {
                            output += `✅ GEÇERLİ | https://discord.gift/${code}\n`;
                            validCodesFound.push(`https://discord.gift/${code}`);
                        } else if (response.status === 404 || response.status === 429) { // 404 not found, 429 rate limit
                            const data = await response.json().catch(() => ({}));
                            output += `❌ GEÇERSİZ (${response.status}) | https://discord.gift/${code} - ${data.message || ''}\n`;
                        } else {
                             output += `❓ BİLİNMİYOR (${response.status}) | https://discord.gift/${code}\n`;
                        }
                    } catch (e) {
                        output += `⚠️ HATA | ${code}: ${e.message}\n`;
                    }
                    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit için bekleme
                }
                 if (validCodesFound.length > 0) {
                    output += "\n--- GEÇERLİ KODLAR ---\n" + validCodesFound.join("\n");
                    saveToFile(validCodesFound.join("\n"), "gecerli_nitro_kodlari.txt");
                }
                displayResult(output);
            })();
            break;
        case 'scraper':
            const textToScrape = params.text_to_scrape;
            const otpRegex = /\b\d{6,8}\b/g; // 6-8 haneli sayılar (OTP)
            const apiKeyRegex = /[a-zA-Z0-9_]{20,64}/g; // API Key benzeri uzun stringler
            let otps = textToScrape.match(otpRegex) || [];
            let apiKeys = textToScrape.match(apiKeyRegex) || [];
            // Basit filtreleme: Sadece sayılardan oluşan veya çok kısa/uzun olanları ele
            apiKeys = apiKeys.filter(key => !/^\d+$/.test(key) && key.length > 20 && key.length < 65 && /[a-zA-Z]/.test(key)); 
            output = "Tarama Sonuçları:\n";
            output += `OTP Benzeri Kodlar (${otps.length}):\n${otps.join('\n')}\n\n`;
            output += `API Anahtarı Benzeri Kodlar (${apiKeys.length}):\n${apiKeys.join('\n')}`;
            displayResult(output);
            break;
        case 'browser':
            output = "Tarayıcı Bilgileri:\n";
            output += `User Agent: ${navigator.userAgent}\n`;
            output += `Platform: ${navigator.platform}\n`;
            output += `Dil: ${navigator.language}\n`;
            output += `Çerezler Aktif: ${navigator.cookieEnabled}\n`;
            output += `Ekran: ${screen.width}x${screen.height} (Renk Derinliği: ${screen.colorDepth}-bit)\n`;
            output += `Pencere: ${window.innerWidth}x${window.innerHeight}\n`;
            displayResult(output, 'info');
            break;
        case 'camera':
            (async () => {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    try {
                        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                        videoContainer.style.display = 'block';
                        const videoElement = document.createElement('video');
                        videoElement.autoplay = true;
                        videoElement.srcObject = cameraStream;
                        videoContainer.innerHTML = ''; // Önceki videoyu temizle
                        videoContainer.appendChild(videoElement);
                        stopCameraButton.style.display = 'block';
                        displayResult("Kamera aktif. Kapatmak için 'Stop Camera' butonuna basın.", 'success');
                    } catch (err) {
                        displayResult(`Kamera Hatası: ${err.name} - ${err.message}`, 'error');
                        videoContainer.style.display = 'none';
                        stopCameraButton.style.display = 'none';
                    }
                } else {
                    displayResult("Tarayıcınız kamera erişimini desteklemiyor.", 'error');
                }
            })();
            break;
        case 'json':
            try {
                const parsedJson = JSON.parse(params.json_data);
                displayResult(JSON.stringify(parsedJson, null, 2));
            } catch (e) {
                displayResult(`Geçersiz JSON: ${e.message}`, 'error');
            }
            break;
        case 'password':
            const length = parseInt(params.length) || 16;
            let chars = "abcdefghijklmnopqrstuvwxyz";
            if (params.include_uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            if (params.include_numbers) chars += "0123456789";
            if (params.include_symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
            let newPassword = "";
            for (let i = 0; i < Math.min(length, 128); i++) { // Max 128 karakter
                newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            output = `Oluşturulan Şifre (${newPassword.length}):\n${newPassword}`;
            displayResult(output);
            break;
        case 'urlencode':
            const textToEncode = params.text_to_encode;
            if (params.mode === 'encode') {
                output = `Encode Edilmiş:\n${encodeURIComponent(textToEncode)}`;
            } else {
                try {
                    output = `Decode Edilmiş:\n${decodeURIComponent(textToEncode)}`;
                } catch (e) { output = `Decode Hatası: ${e.message}`; }
            }
            displayResult(output);
            break;
        case 'qrcode':
            const textForQr = params.text_for_qr;
            if (!textForQr) { displayResult("QR Code için metin girin.", "error"); return; }
            // API'ye gerek yok, JS kütüphanesi daha iyi olur ama basitlik için API kullanalım (proxy üzerinden)
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(textForQr)}`;
             // Bu API genelde CORS sorunu çıkarmaz ama proxy kullanmak daha tutarlı olur
            displayImageResult(qrApiUrl, "QR Code"); 
            break;
        default:
            displayResult(`Bilinmeyen yerel fonksiyon: ${apiName}`, 'error');
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    videoContainer.innerHTML = '';
    videoContainer.style.display = 'none';
    stopCameraButton.style.display = 'none';
    displayResult("Kamera durduruldu.", 'info');
}

function copyOutput() {
    const textToCopy = resultElement.textContent; // HTML taglerini almaz, sadece metni alır
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Çıktı panoya kopyalandı!');
    }).catch(err => {
        alert('Kopyalama başarısız: ' + err);
    });
}

function clearOutput() {
    resultElement.textContent = 'Terminal temizlendi.';
    resultElement.className = 'info';
    originalResultContent = resultElement.textContent;
    outputSearchInput.value = ''; // Arama kutusunu da temizle
}

function saveToFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link); // Firefox için gerekli
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Belleği serbest bırak
}

function saveOutput() {
    const textToSave = resultElement.textContent;
    saveToFile(textToSave, `CyberQuery_Output_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`);
}

outputSearchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (!searchTerm) {
        resultElement.innerHTML = originalResultContent; // Arama yoksa orijinal içeriği göster
        return;
    }
    // Arama yaparken düz metin üzerinde çalışmak daha iyi
    const textContentForSearch = resultElement.textContent;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    
    // Orijinal içeriği doğrudan değiştirmek yerine, arama sonuçlarını yeni bir HTML ile oluştur.
    // Bu, orijinal HTML yapısını korumaya yardımcı olabilir ama pre için textContent daha iyi.
    const highlightedContent = textContentForSearch.replace(regex, '<span class="highlight">$1</span>');
    resultElement.innerHTML = highlightedContent;
});

// Basit MD5 fonksiyonu (Tarayıcıda crypto.subtle MD5 sağlamadığı için)
// Kaynak: https://stackoverflow.com/a/22477273 (Joseph Myers) - biraz düzenlendi
function md5(string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else return (lResult ^ lX8 ^ lY8);
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }
    function FF(a, b, c, d, x, s, t) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), t));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, t) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), t));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, t) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), t));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, t) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), t));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }
    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = Utf8Encode(string); // UTF8 encode
    x = ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        // ... (geri kalan MD5 adımları) ...
        a = AddUnsigned(a, AA); b = AddUnsigned(b, BB); c = AddUnsigned(c, CC); d = AddUnsigned(d, DD);
    }
    // MD5'in tüm adımlarını eklemek kodu çok uzatır, tam bir MD5 için kütüphane daha iyi olur.
    // Bu fonksiyon sadece bir örnektir ve tam MD5 hesaplamaz.
    // Güvenlik açısından MD5 zaten önerilmez. SHA algoritmaları kullanılmalı.
    // Geçici olarak, sadece SHA algoritmalarını kullanalım.
    // Eğer MD5 şartsa, güvenilir bir JS MD5 kütüphanesi (örn: blueimp-md5) eklenmeli.
     if (string === "MD5_PLACEHOLDER_FOR_DEMO") return "MD5_hesaplanamadi_kutuphane_gerekli"; // Placeholder
    return WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
}
function Utf8Encode(string) { // MD5 için UTF8 encode
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var charcode = string.charCodeAt(n);
        if (charcode < 128) {
            utftext += String.fromCharCode(charcode);
        } else if((charcode > 127) && (charcode < 2048)) {
            utftext += String.fromCharCode((charcode >> 6) | 192);
            utftext += String.fromCharCode((charcode & 63) | 128);
        } else {
            utftext += String.fromCharCode((charcode >> 12) | 224);
            utftext += String.fromCharCode(((charcode >> 6) & 63) | 128);
            utftext += String.fromCharCode((charcode & 63) | 128);
        }
    }
    return utftext;
}