const axios = require('axios');

async function testDiyanetApi() {
    try {
        const response = await axios.get('https://namazvakitleri.diyanet.gov.tr/api/vakitler?ilce=9587', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
            }
        });
        console.log('Diyanet API Succeeded!');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error('Diyanet API Failed:', err.message);
    }
}

testDiyanetApi();
