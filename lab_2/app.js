const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./src/config/database');
const todoRoutes = require('./src/routes/todo');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use('/todo', todoRoutes);

// Global error handler
app.use(errorHandler);

// Graceful shutdown + миграции
const PORT = process.env.PORT || 4200;

sequelize.sync({ alter: false }).then(async () => {
  // Если нужно запустить миграции программно (опционально)
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('DB sync error:', err);
});