/**
 * 🚀 NIGHTRAID™ OFFICIAL API
 * Owner: Chenith
 * Platform: Render (PC Upload)
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const yts = require('yt-search');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- 🛡️ BROWSER HEADERS ---
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.google.com/'
};

// 🏠 HOME
app.get('/', (req, res) => {
    res.json({ 
        status: true, 
        message: "NIGHTRAID API ONLINE 🚀", 
        owner: "Chenith" 
    });
});

// 🎵 1. SONG DOWNLOADER
app.get('/song', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ status: false, msg: "Query required" });

    try {
        const search = await yts(query);
        const vid = search.videos[0];
        if (!vid) return res.json({ status: false, msg: "Not found" });

        let dlUrl = null;

        // Server 1
        try {
            const r1 = await axios.get(`https://api.davidcyriltech.my.id/download/ytmp3?url=${vid.url}`);
            if (r1.data?.result?.download_url) dlUrl = r1.data.result.download_url;
        } catch (e) {}

        // Server 2 (Fallback)
        if (!dlUrl) {
            try {
                const r2 = await axios.get(`https://widipe.com/download/ytdl?url=${vid.url}`);
                if (r2.data?.result?.mp3) dlUrl = r2.data.result.mp3;
            } catch (e) {}
        }

        if (dlUrl) {
            res.json({
                status: true,
                result: {
                    title: vid.title,
                    thumb: vid.thumbnail,
                    timestamp: vid.timestamp,
                    dl_link: dlUrl
                }
            });
        } else {
            res.json({ status: false, msg: "Servers Busy" });
        }
    } catch (e) {
        res.json({ status: false, msg: e.message });
    }
});

// 🇱🇰 2. SINHALASUB MOVIE
app.get('/movie', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ status: false, msg: "Query required" });

    try {
        const { data } = await axios.get(`https://sinhalasub.lk/?s=${encodeURIComponent(query)}`, { headers: HEADERS });
        const $ = cheerio.load(data);
        const first = $('.result-item article').first();

        if (!first.length) return res.json({ status: false, msg: "Not found" });

        const title = first.find('.title a').text();
        const link = first.find('.title a').attr('href');
        const img = first.find('img').attr('src');
        const rating = first.find('.rating').text();

        res.json({
            status: true,
            result: {
                title: title,
                link: link,
                image: img,
                rating: rating
            }
        });
    } catch (e) {
        res.json({ status: false, msg: "Error" });
    }
});

// 📱 3. TIKTOK
app.get('/tiktok', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ status: false, msg: "URL required" });
    try {
        const { data } = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        if (data.data) {
            res.json({
                status: true,
                result: {
                    title: data.data.title,
                    video: data.data.play
                }
            });
        } else {
            res.json({ status: false, msg: "Video not found" });
        }
    } catch (e) {
        res.json({ status: false, msg: "Error" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Nightraid API running on port ${PORT}`);
});