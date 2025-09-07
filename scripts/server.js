// Simple Express server setup to serve the build output
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');

const app = express();
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'", "https://fredbirds-api.herokuapp.com", "https://api.ebird.org"],
                imgSrc: ["'self'", "https://fredbirds-098f.restdb.io", "data:", "https:"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "https:"],
                styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                frameSrc: ["'self'", "https://www.google.com", "https://*.google.com"]
            }
        }
    })
);
app.use(compression());

// Add process shim for client-side code
app.use((req, res, next) => {
    if (req.url === '/process-shim.js') {
        res.type('application/javascript');
        res.send('window.process = { env: {} };');
    } else {
        next();
    }
});

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const DIST_DIR = './dist';

app.use(express.static(DIST_DIR));

app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);
