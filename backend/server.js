
// server.js - Express backend for the Email Builder
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(bodyParser.json());

// Serve static layout.html
app.get('/getEmailLayout', (req, res) => {
    const layoutPath = path.join(__dirname, 'layout.html');
    res.sendFile(layoutPath);
});

// Upload image API
app.post('/uploadImage', upload.single('image'), (req, res) => {
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Save email configuration API
app.post('/uploadEmailConfig', (req, res) => {
    const emailConfig = req.body;
    fs.writeFileSync('emailConfig.json', JSON.stringify(emailConfig, null, 2));
    res.sendStatus(200);
});

// Render and download template API
app.post('/renderAndDownloadTemplate', (req, res) => {
    const { title, content, footer, imageUrls } = req.body;
    const layout = fs.readFileSync(path.join(__dirname, 'layout.html'), 'utf-8');
    let rendered = layout.replace('{{title}}', title)
                         .replace('{{content}}', content)
                         .replace('{{footer}}', footer);
    imageUrls.forEach((url, index) => {
        rendered = rendered.replace(`{{image${index + 1}}}`, `<img src="${url}" alt="Image ${index + 1}"/>`);
    });
    const outputFile = path.join(__dirname, 'output.html');
    fs.writeFileSync(outputFile, rendered);
    res.download(outputFile);
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
