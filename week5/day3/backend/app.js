const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

const HOSTNAME = process.env.HOSTNAME || "Wonder_Women";

app.get('/', (req, res) => {
    return res.json({
        message: "This is BACKEND",
        instance: HOSTNAME,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => console.log(`BACKEND on PORT:${PORT}`));