const express = require('express');

const app = express();
const PORT = process.env.PORT || 4200;

/**
 * Вычисляет количество дней до следующего Нового года (1 января)
 * @returns {number} Количество дней
 */
function getDaysBeforeNewYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const newYear = new Date(currentYear + 1, 0, 1);

    const diffMs = newYear - now;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    return days;
}

app.get('/info', (req, res) => {
    res.status(200).json({
        days_before_new_year: getDaysBeforeNewYear()
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`try: curl http://localhost:${PORT}/info`);
});