document.addEventListener('DOMContentLoaded', function() {
    // Данные, полученные из файла Excel
    const scheduleData = [
        ['Понедельник', '8:10-9:45', '', ''],
        ['', '9:55-11:30', '', ''],
        ['', '11:40-13:15', 'Реализация параллельных вычислительных процессов', 'Реализация параллельных вычислительных процессов'],
        ['', '13:35-15:10', 'Информационная безопасность (Пр.)\nШакурский М.В.', 'Информационная безопасность (Лб.)\nШакурский М.В.'],
        ['', '15:20-16:55', 'Теория автоматов и формальных языков (Лб.)\nСеледков', 'Теория автоматов и формальных языков (Лб.)\nСеледков']
    ];

    // Функция для отображения данных в таблице
    function loadSchedule(data) {
        const tableBody = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';  // Очищаем таблицу перед новым выводом

        // Проходим по каждой строке данных и добавляем их в таблицу
        data.forEach(function(row) {
            const newRow = tableBody.insertRow();

            row.forEach(function(cell) {
                const newCell = newRow.insertCell();
                newCell.contentEditable = 'true';  // Делаем ячейку редактируемой
                newCell.textContent = cell;
            });
        });
    }

    // Загрузка данных расписания
    loadSchedule(scheduleData);

    // Функция для сохранения изменений
    document.getElementById('saveBtn').addEventListener('click', function() {
        const table = document.getElementById('scheduleTable');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        const updatedData = [];
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            const row = [];
            for (let j = 0; j < cells.length; j++) {
                row.push(cells[j].textContent);
            }
            updatedData.push(row);
        }

        // Выводим обновленные данные в консоль (можно реализовать экспорт в Excel)
        console.log(updatedData);

        // Экспорт в Excel
        const worksheet = XLSX.utils.aoa_to_sheet(updatedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Расписание');
        
        // Сохраняем файл
        XLSX.writeFile(workbook, 'Обновленное_расписание.xlsx');
    });
});
