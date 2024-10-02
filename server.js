const express = require('express');
const { getSubtitles, getVideoDetails } = require('youtube-caption-extractor');
require('dotenv').config(); // Para usar variáveis de ambiente

const app = express();
const port = process.env.PORT || 3000;

// Middleware para autenticação com chave de API
const authenticateAPIKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (apiKey && apiKey === process.env.API_KEY) {
        next(); // Se a chave for válida, continua para o próximo middleware ou rota
    } else {
        res.status(403).json({ error: 'Acesso negado. Chave de API inválida ou ausente.' });
    }
};

// Use o middleware de autenticação antes de suas rotas protegidas
app.use(authenticateAPIKey);

// Rota para buscar legendas
app.get('/api/subtitles', async (req, res) => {
    const videoID = req.query.videoID;
    const lang = req.query.lang || 'pt'; // Idioma padrão é pt

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
    const lang = req.query.lang || 'pt'; // Idioma padrão é pt

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

// Inicia o servidor
app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});
