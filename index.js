const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { fetchPrayerTimes } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = process.env.VERCEL ? path.join('/tmp', 'data.json') : path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Verileri önbelleğe (cache) kaydetmek için yardımcı fonksiyon
function saveData(data) {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Veri kaydedilemedi (Vercel kısıtlaması olabilir):', err.message);
    }
}

// Kayıtlı veriyi oku
function loadData() {
    try {
        if (fs.existsSync(DATA_PATH)) {
            return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
        }
    } catch (err) {
        console.error('Veri okunamadı:', err.message);
    }
    return null;
}

// Güncelleme fonksiyonu
async function updateVakitler() {
    console.log(`[${new Date().toLocaleString()}] Veriler güncelleniyor...`);
    try {
        const newData = await fetchPrayerTimes();
        if (newData && Object.keys(newData).length > 0) {
            saveData(newData);
            console.log('Güncelleme başarılı.');
            return newData;
        }
        throw new Error('Çekilen veri boş.');
    } catch (error) {
        console.error('Güncelleme hatası:', error.message);
        return null;
    }
}

// Her gün gece 00:01'de çalışacak zamanlayıcı
cron.schedule('1 0 * * *', () => {
    updateVakitler();
});

// Manuel tetikleme uç noktası (Test için)
app.get('/api/refresh', async (req, res) => {
    const data = await updateVakitler();
    if (data) {
        res.json({ message: 'Veriler güncellendi', data });
    } else {
        res.status(500).json({ message: 'Güncelleme başarısız' });
    }
});

// Ana API uç noktası
app.get('/api/vakitler', async (req, res) => {
    let data = loadData();

    // Eğer veri yoksa hemen çek
    if (!data) {
        data = await updateVakitler();
    }

    if (data) {
        res.json(data);
    } else {
        res.status(500).json({ message: 'Veri ulaşılamaz durumda' });
    }
});

// Sunucuyu başlat
app.listen(PORT, async () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);

    // Başlangıçta veriyi kontrol et/yükle
    if (!loadData()) {
        await updateVakitler();
    }
});
