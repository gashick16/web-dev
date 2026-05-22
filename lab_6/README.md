# Лабораторная работа №3
## Тема: Авторизация и аутентификация (JWT, OAuth2, Cookies)

### Цель работы
- Изучить различия между процессами аутентификации (Authentication) и авторизации (Authorization).
- Понять внутренние механизмы работы протоколов аутентификации без использования высокоуровневых библиотек-абстракций.
- Освоить принципы работы с токенами доступа (JWT) и механизмом обновления сессий (Refresh Tokens).
- Реализовать механизм безопасного хранения паролей (хеширование с использованием уникальной соли).
- Изучить протокол OAuth 2.0 и реализовать вход через сторонних провайдеров (на примере российских сервисов) вручную.
- Реализовать безопасную передачу токенов с использованием `HttpOnly` cookies.
- Реализовать серверское хранение Refresh токенов в базе данных для возможности управления сессиями (отзыв доступа).
- Закрепить навыки защиты эндпоинтов с помощью промежуточного ПО (Middleware/Guards).
- Продолжить развитие архитектуры приложения (Лабораторная работа №2) с соблюдением принципов модульности и безопасности.

### Настройка
Создать вайл .env и заполнить все значения
```
# Database
DB_USER=student
DB_PASSWORD=12345678
DB_NAME=wp_labs
DB_HOST=postgres
# DB_HOST=localhost
DB_PORT=5432

# Application
PORT=4200
NODE_ENV=development

# Authorization
SALT_ROUNDS=15

ACCESS_SECRET=010jdyHEIlo4vIVrOfEgVoR11466TJUUd4FH4Qdp4Mj
ACCESS_EXPIRE=60 # 60 sec
REFRESH_SECRET=T1oKlnWQJzLS8uP0upLdomOCBtEfLvV5M5OOyJW7jCE
REFRESH_EXPIRE=1296000 # 15 * 24 * 60 * 60 = 15 days

YANDEX_CLIENT_ID=f0f0283958004d909901c309c83980fb
YANDEX_CLIENT_SECRET=8bba6702685f4262b67ca16ea9d47f8e
YANDEX_REDIRECT_URI=http://localhost:4200/auth/oauth/yandex/callback

# Redis
REDIS_PASSWORD=tye0RCrbE8k4
REDIS_HOST=redis
REDIS_PORT=6379
TTL_SECONDS=1296000
```

### Запуск
```bash
docker-compose up --build
```

### Результат
Документация доступна по пути `/api/docs`

### Остановка
```bash
docker-compose stop
```

### Стек
- TypeScript
- NestJs
- TypeORM
- PostgreSQL
- Docker
- Redis