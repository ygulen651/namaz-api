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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
