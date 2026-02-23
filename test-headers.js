const axios = require('axios');
const fs = require('fs');

const URL = 'https://namazvakitleri.diyanet.gov.tr/tr-TR/9587/karaman-namaz-vakitleri';

async function testHeaders() {
    try {
        const response = await axios.get(URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        console.log('Succeeded!');
        fs.writeFileSync('debug_headers.html', response.data);
        console.log('Length:', response.data.length);
        if (response.data.includes('İmsak')) {
            console.log('FOUND IMSAK!');
        } else {
            console.log('IMSAK NOT FOUND');
        }
    } catch (err) {
        console.error('Failed:', err.message);
        if (err.response) {
            fs.writeFileSync('debug_headers_error.html', err.response.data);
        }
    }
}

testHeaders();
