document.addEventListener('DOMContentLoaded', () => {
    const ssidInput = document.getElementById('ssidInput');
    const generateBtn = document.getElementById('generateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const passwordResult = document.getElementById('passwordResult');
    const copyBtn = document.getElementById('copyBtn');
    const copyToast = document.getElementById('copyToast');

    // خريطة التبديل (Substitution Map)
    const charMap = {
        '0': 'f', 'f': '0',
        '1': 'e', 'e': '1',
        '2': 'd', 'd': '2',
        '3': 'c', 'c': '3',
        '4': 'b', 'b': '4',
        '5': 'a', 'a': '5',
        '6': '9', '9': '6',
        '7': '8', '8': '7'
    };

    function processSSID(ssid) {
        let lowerSsid = ssid.toLowerCase().trim();
        
        if (!lowerSsid) return null;

        let prefix = "";
        let hexPart = lowerSsid;
        
        // التحقق من البادئات وتبديلها إلى wlan
        if (lowerSsid.startsWith('fh_')) {
            prefix = 'wlan';
            hexPart = lowerSsid.substring(3); // إزالة fh_
        } else if (lowerSsid.startsWith('fh')) {
            prefix = 'wlan';
            hexPart = lowerSsid.substring(2); // إزالة fh
        } else if (lowerSsid.startsWith('d4fs_')) {
            prefix = 'wlan';
            hexPart = lowerSsid.substring(5); // إزالة d4fs_
        } else if (lowerSsid.startsWith('d4fs')) {
            prefix = 'wlan';
            hexPart = lowerSsid.substring(4); // إزالة d4fs
        }

        // تطبيق خريطة التبديل على الجزء المتبقي
        let translatedHex = '';
        for (let char of hexPart) {
            if (charMap[char]) {
                translatedHex += charMap[char];
            } else {
                translatedHex += char; // الحفاظ على الحروف الأخرى كما هي
            }
        }
        
        return prefix + translatedHex;
    }

    function generate() {
        const ssid = ssidInput.value;
        const password = processSSID(ssid);

        if (password) {
            passwordResult.textContent = password;
            resultContainer.classList.remove('hidden');
            
            // Animation effect
            resultContainer.style.transform = 'scale(0.95)';
            setTimeout(() => {
                resultContainer.style.transform = 'scale(1)';
            }, 150);
        } else {
            // إخفاء النتيجة إذا كان الحقل فارغاً
            resultContainer.classList.add('hidden');
            ssidInput.focus();
            
            // اهتزاز الحقل للتنبيه
            ssidInput.style.transform = 'translateX(-10px)';
            setTimeout(() => ssidInput.style.transform = 'translateX(10px)', 50);
            setTimeout(() => ssidInput.style.transform = 'translateX(-10px)', 100);
            setTimeout(() => ssidInput.style.transform = 'translateX(10px)', 150);
            setTimeout(() => ssidInput.style.transform = 'translateX(0)', 200);
        }
    }

    generateBtn.addEventListener('click', generate);

    ssidInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generate();
        }
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = passwordResult.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show toast
            copyToast.classList.add('show');
            
            // Change icon temporarily
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            
            setTimeout(() => {
                copyToast.classList.remove('show');
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
});
