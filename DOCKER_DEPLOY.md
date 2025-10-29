# Деплой через Docker

## Быстрый старт

### 1. Используя Docker Compose (рекомендуется)

```bash
# Создайте файл .env с необходимыми переменными
cat > .env << EOF
GEMINI_API_KEY=ваш_ключ_gemini
DATABASE_URL=postgresql://user:password@db:5432/digitalurpaq
EOF

# Запустите приложение с базой данных
docker-compose up -d

# Проверьте статус
docker-compose ps

# Просмотр логов
docker-compose logs -f app
```

Приложение будет доступно на http://localhost:5000

### 2. Используя только Docker

```bash
# Соберите образ
docker build -t digitalurpaq-app .

# Запустите контейнер
docker run -d \
  --name digitalurpaq \
  -p 5000:5000 \
  -e GEMINI_API_KEY=ваш_ключ_gemini \
  -e NODE_ENV=production \
  digitalurpaq-app

# Проверьте логи
docker logs -f digitalurpaq
```

## Конфигурация

### Переменные окружения

| Переменная | Описание | Обязательно | По умолчанию |
|-----------|----------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini API ключ | Да (для AI функций) | - |
| `DATABASE_URL` | PostgreSQL connection string | Нет | In-memory storage |
| `NODE_ENV` | Окружение (production/development) | Нет | production |
| `PORT` | Порт приложения | Нет | 5000 |

### Получение Gemini API ключа

1. Перейдите на https://aistudio.google.com/apikey
2. Войдите в Google аккаунт
3. Нажмите "Create API Key"
4. Скопируйте ключ

## Управление

### Docker Compose команды

```bash
# Старт
docker-compose up -d

# Остановка
docker-compose down

# Перезапуск
docker-compose restart

# Остановка с удалением volumes
docker-compose down -v

# Пересборка образа
docker-compose up -d --build

# Масштабирование приложения
docker-compose up -d --scale app=3
```

### Обновление приложения

```bash
# Получите последние изменения
git pull

# Пересоберите и перезапустите
docker-compose up -d --build
```

## Продакшен деплой

### На VPS/Dedicated сервере

1. **Установите Docker и Docker Compose:**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo apt-get install docker-compose-plugin
```

2. **Клонируйте репозиторий:**
```bash
git clone <your-repo-url>
cd <repo-directory>
```

3. **Настройте переменные окружения:**
```bash
nano .env
# Добавьте все необходимые переменные
```

4. **Запустите приложение:**
```bash
docker-compose up -d
```

5. **Настройте nginx reverse proxy (опционально):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### На облачных платформах

#### AWS ECS

```bash
# Соберите и загрузите образ в ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin account-id.dkr.ecr.region.amazonaws.com
docker build -t digitalurpaq .
docker tag digitalurpaq:latest account-id.dkr.ecr.region.amazonaws.com/digitalurpaq:latest
docker push account-id.dkr.ecr.region.amazonaws.com/digitalurpaq:latest

# Создайте задачу и сервис в ECS
```

#### Google Cloud Run

```bash
# Соберите и загрузите образ
gcloud builds submit --tag gcr.io/project-id/digitalurpaq

# Задеплойте
gcloud run deploy digitalurpaq \
  --image gcr.io/project-id/digitalurpaq \
  --platform managed \
  --region europe-central2 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-key
```

#### DigitalOcean App Platform

```bash
# Используйте doctl CLI или Web UI
doctl apps create --spec .do/app.yaml
```

## Мониторинг

### Проверка здоровья приложения

```bash
# HTTP запрос
curl http://localhost:5000/api/clubs

# Docker healthcheck
docker inspect --format='{{.State.Health.Status}}' digitalurpaq
```

### Логи

```bash
# Docker Compose
docker-compose logs -f app

# Docker
docker logs -f digitalurpaq

# Последние 100 строк
docker logs --tail 100 digitalurpaq
```

## Резервное копирование

### База данных

```bash
# Создание бэкапа
docker-compose exec db pg_dump -U user digitalurpaq > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
docker-compose exec -T db psql -U user digitalurpaq < backup_20241029_120000.sql
```

## Troubleshooting

### Приложение не запускается

```bash
# Проверьте логи
docker-compose logs app

# Проверьте переменные окружения
docker-compose config

# Пересоберите образ
docker-compose build --no-cache app
```

### База данных не подключается

```bash
# Проверьте статус БД
docker-compose ps db

# Проверьте логи БД
docker-compose logs db

# Проверьте network
docker network inspect <project>_app-network
```

### Out of memory

```bash
# Увеличьте лимиты памяти в docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

## Оптимизация

### Multi-stage build
Образ уже использует multi-stage build для минимизации размера (см. Dockerfile).

### Кэширование слоев
Docker кэширует слои при сборке. Порядок команд в Dockerfile оптимизирован для максимального использования кэша.

### Health checks
В Dockerfile настроен healthcheck для мониторинга состояния приложения.

## Безопасность

- ✅ Приложение запускается от non-root пользователя
- ✅ Используется Alpine Linux для минимизации поверхности атаки
- ✅ Секреты передаются через переменные окружения
- ✅ Production зависимости изолированы от dev зависимостей

## Поддержка

Дворец школьников "DIGITAL URPAQ"
- Website: https://digitalurpaq.edu.kz
- Address: V438+J5W, ул. Таштинова, Петропавловск 150000
- Phone: +7 (7152) 34-02-40
