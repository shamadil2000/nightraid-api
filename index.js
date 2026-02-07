/**
 * 🚀 NIGHTRAID™ API V2 (POWERED ENGINE)
 * Updated: Multi-Server Support
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const yts = require('yt-search');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// 🏠 HOME
app.get('/', (req, res) => {
    res.json({ status: true, msg: "NIGHTRAID ENGINE V2 ONLINE 🔥" });
});

// 🎵 POWERFUL SONG DOWNLOADER
app.get('/song', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ status: false, msg: "Query required" });

    try {
        // 1. YouTube Search
        const search = await yts(query);
        const vid = search.videos[0];
        if (!vid) return res.json({ status: false, msg: "Video not found" });

        let dlUrl = null;

        // 🔥 ENGINE 1: COBALT (Best Quality)
        if (!dlUrl) {
            try {
                const r1 = await axios.post('https://cobalt.api.kannada.ga/', {
                    url: vid.url,
                    audioFormat: "mp3",
                    isAudioOnly: true
                }, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });
                
                if (r1.data?.url) dlUrl = r1.data.url;
            } catch (e) { console.log("Engine 1 Fail"); }
        }

        // 🔥 ENGINE 2: DARK YTDL (Backup)
        if (!dlUrl) {
            try {
                const r2 = await axios.get(`https://api.dreaded.site/api/ytdl/audio?url=${vid.url}`);
                if (r2.data?.result?.download?.url) dlUrl = r2.data.result.download.url;
            } catch (e) { console.log("Engine 2 Fail"); }
        }

        // 🔥 ENGINE 3: WIDIPE (Last Option)
        if (!dlUrl) {
            try {
                const r3 = await axios.get(`https://widipe.com/download/ytdl?url=${vid.url}`);
                if (r3.data?.result?.mp3) dlUrl = r3.data.result.mp3;
            } catch (e) { console.log("Engine 3 Fail"); }
        }

        // RESULT
        if (dlUrl) {
            res.json({
                status: true,
                result: {
                    title: vid.title,
                    thumb: vid.thumbnail,
                    timestamp: vid.timestamp,
                    dl_link: dlUrl,
                    ago: vid.ago
                }
            });
        } else {
            res.json({ status: false, msg: "All Servers Busy. Try again later." });
        }

    } catch (e) {
        res.json({ status: false, msg: e.message });
    }
});

// 🎬 SINHALASUB & TIKTOK (Standard)
app.get('/movie', async (req, res) => res.json({ status: false, msg: "Update Pending" })); 
app.get('/tiktok', async (req, res) => res.json({ status: false, msg: "Update Pending" }));

app.listen(PORT, () => console.log(`🔥 Engine running on ${PORT}`));