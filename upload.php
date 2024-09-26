<?php
// Укажите директорию для сохранения загружаемых файлов
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// Проверка, является ли файл реальным
if (isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if ($check !== false) {
        echo "Файл является изображением - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "Файл не является изображением.";
        $uploadOk = 0;
    }
}

// Проверка существования файла
if (file_exists($target_file)) {
    echo "Извините, файл уже существует.";
    $uploadOk = 0;
}

// Ограничение по размеру файла
if ($_FILES["fileToUpload"]["size"] > 500000) { // 500 Кб
    echo "Извините, файл слишком большой.";
    $uploadOk = 0;
}

// Разрешение определенных форматов файлов
if ($fileType != "jpg" && $fileType != "png" && $fileType != "jpeg" && $fileType != "gif") {
    echo "Извините, только JPG, JPEG, PNG и GIF файлы разрешены.";
    $uploadOk = 0;
}

// Проверка на ошибки загрузки
if ($uploadOk == 0) {
    echo "Извините, файл не загружен.";
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "Файл ". htmlspecialchars(basename($_FILES["fileToUpload"]["name"])) . " успешно загружен.";
    } else {
        echo "Извините, возникла ошибка при загрузке файла.";
    }
}
?>
