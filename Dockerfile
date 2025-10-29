# Multi-stage build для оптимизации размера образа
FROM node:20-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production && \
    npm ci --only=development

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Production образ
FROM node:20-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование package.json для production зависимостей
COPY package*.json ./

# Установка только production зависимостей
RUN npm ci --only=production && \
    npm cache clean --force

# Копирование собранного приложения из builder
COPY --from=builder /app/dist ./dist

# Создание пользователя без root прав для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Изменение владельца файлов
RUN chown -R nodejs:nodejs /app

# Переключение на non-root пользователя
USER nodejs

# Открытие порта
EXPOSE 5000

# Установка переменных окружения
ENV NODE_ENV=production
ENV PORT=5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/clubs', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Запуск приложения
CMD ["node", "dist/index.js"]
