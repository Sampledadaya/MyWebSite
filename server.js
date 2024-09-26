const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка директории для загрузок
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Настройка multer для обработки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Сохраняем файл с оригинальным именем
    }
});

const upload = multer({ storage: storage });

// Разрешаем доступ к статическим файлам
app.use('/uploads', express.static('uploads'));

// Главная страница с формой загрузки
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

// Обработка загрузки файла
app.post('/upload', upload.single('fileToUpload'), (req, res) => {
    if (req.file) {
        res.send(`<h1>Файл ${req.file.originalname} успешно загружен!</h1><a href="/">Загрузить другой файл</a>`);
    } else {
        res.send('<h1>Ошибка загрузки файла.</h1>');
    }
});

// Отображение загруженных файлов
app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).send('Ошибка при чтении директории.');
        
        let fileList = '<h1>Загруженные файлы</h1>';
        files.forEach(file => {
            fileList += `<a href="/uploads/${file}" target="_blank">${file}</a><br>`;
        });
        res.send(fileList);
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
