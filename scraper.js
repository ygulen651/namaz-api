const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://www.vakitci.com/turkiye/karaman/karaman-merkez/';

/**
 * Vakitci sitesinden namaz vakitlerini çeker.
 */
async function fetchPrayerTimes() {
    try {
        const { data } = await axios.get(URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const prayerTimes = {};

        // Günlük vakitleri çekelim
        // .ezan-vakti yapısı: ilk div (vakit adı), ikinci div (saat)
        $('.ezan-vakti').each((i, el) => {
            const title = $(el).find('div').first().text().trim().toLowerCase();
            const time = $(el).find('div').last().text().trim();

            if (title && time) {
                // Türkçe karakterleri temizleyip anahtar olarak kullanalım
                const key = title
                    .replace(/ı/g, 'i')
                    .replace(/ğ/g, 'g')
                    .replace(/ü/g, 'u')
                    .replace(/ş/g, 's')
                    .replace(/ö/g, 'o')
                    .replace(/ç/g, 'c');

                prayerTimes[key] = time;
            }
        });

        // Tarih bilgisini alalım (#tarih div içindeki metin)
        const dateStr = $('#tarih div').first().text().replace('Miladi :', '').trim();
        prayerTimes['tarih'] = dateStr || new Date().toLocaleDateString('tr-TR');

        return prayerTimes;
    } catch (error) {
        console.error('Veri çekme hatası:', error.message);
        throw error;
    }
}

module.exports = { fetchPrayerTimes };
