const { fetchPrayerTimes } = require('./scraper');

async function test() {
    console.log('Veriler çekiliyor...');
    try {
        const data = await fetchPrayerTimes();
        console.log('Başarılı! Çekilen Veriler:');
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Test başarısız:', err);
    }
}

test();
