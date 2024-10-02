const express = require('express');
const { getSubtitles, getVideoDetails } = require('youtube-caption-extractor');

const app = express();
const port = process.env.PORT || 3000; // Porta que a API vai rodar

// Rota para buscar legendas
app.get('/api/subtitles', async (req, res) => {
    const videoID = req.query.videoID;
    const lang = req.query.lang || 'en'; // Definindo inglês como idioma padrão

    if (!videoID) {
        return res.status(400).json({ error: 'videoID é necessário' });
    }

    try {
        const subtitles = await getSubtitles({ videoID, lang });
        res.json({ subtitles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para buscar detalhes do vídeo
app.get('/api/videodetails', async (req, res) => {
    const videoID = req.query.videoID;
    const lang = req.query.lang || 'en'; // Idioma padrão é inglês

    if (!videoID) {
        return res.status(400).json({ error: 'videoID é necessário' });
    }

    try {
        const videoDetails = await getVideoDetails({ videoID, lang });
        res.json({ videoDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
