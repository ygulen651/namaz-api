const axios = require('axios');

async function testAlAdhan() {
    try {
        const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
            params: {
                city: 'Karaman',
                country: 'Turkey',
                method: 13 // Diyanet
            }
        });
        console.log('AlAdhan Succeeded!');
        console.log(JSON.stringify(response.data.data.timings, null, 2));
    } catch (err) {
        console.error('AlAdhan Failed:', err.message);
    }
}

testAlAdhan();
