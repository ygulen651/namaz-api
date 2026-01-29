const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://namazvakitleri.diyanet.gov.tr/tr-TR/9587/karaman-namaz-vakitleri';

/**
 * Diyanet web sitesinden namaz vakitlerini çeker.
 */
async function fetchPrayerTimes() {
    try {
        const { data } = await axios.get(URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
            }
        });

        const $ = cheerio.load(data);
        const prayerTimes = {};

        // Günlük vakitleri üst kısımdan çekelim
        // .tpt-cell yapısı: .tpt-title (vakit adı), .tpt-time (saat)
        $('.tpt-cell').each((i, el) => {
            const title = $(el).find('.tpt-title').text().trim().toLowerCase();
            const time = $(el).find('.tpt-time').text().trim();

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

        // Tarih bilgisini de alalım
        const dateStr = $('.vakit-kalan-gun-text').text().trim();
        prayerTimes['tarih'] = dateStr || new Date().toLocaleDateString('tr-TR');

        return prayerTimes;
    } catch (error) {
        console.error('Veri çekme hatası:', error.message);
        throw error;
    }
}

module.exports = { fetchPrayerTimes };
