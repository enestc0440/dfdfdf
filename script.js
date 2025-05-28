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
    discordnitrogenerator_ondex: { proxy: true, url: 'https://api.ondex.uk/ondexapi/discordnitrogenerator.php', params: ['adet'] },
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
        label.htmlFor = `<span class="math-inline">\{category\}\-</span>{param}`;
        label.textContent = param.replace(/_/g, ' ').toUpperCase() + ':';
        div.appendChild(label);

        if (param === 'type' && selectedApiValue === 'hash') {
            const select = document.createElement('select');
            select.id = `<span class="math-inline">\{category\}\-</span>{param}`;
            ['md5', 'sha1', 'sha256', 'sha512'].forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt.toUpperCase();
                select.appendChild(option);
            });
            div.appendChild(select);
        } else if (param === 'mode' && selectedApiValue === 'urlencode') {
            const select = document.createElement('select');
