const axios = require('axios');
const fs = require('fs');

async function testImsakiyem() {
    try {
        const response = await axios.get('https://ezanvakti.imsakiyem.com/api/prayer-times/9587/daily');
        console.log('Imsakiyem Succeeded!');
        fs.writeFileSync('debug_imsakiyem.json', JSON.stringify(response.data, null, 2));
        console.log('Saved to debug_imsakiyem.json');
    } catch (err) {
        console.error('Imsakiyem Failed:', err.message);
    }
}

testImsakiyem();
