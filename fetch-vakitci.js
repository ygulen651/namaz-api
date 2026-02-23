const axios = require('axios');
const fs = require('fs');

const URL = 'https://www.vakitci.com/turkiye/karaman/karaman-merkez/';

async function fetchHtml() {
    try {
        const response = await axios.get(URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            }
        });
        fs.writeFileSync('vakitci.html', response.data);
        console.log('HTML saved to vakitci.html');
    } catch (err) {
        console.error('Fetch failed:', err.message);
    }
}

fetchHtml();
