# Деплой Digital Urpaq в продакшен

## Подготовка к деплою на Replit

Этот проект настроен для автоматического деплоя на Replit. Вот что нужно знать:

### 1. Конфигурация деплоя

Проект использует **Autoscale deployment** - это идеально для веб-приложений, которые не требуют постоянного запущенного сервера.

**Настроенные команды:**
- **Build**: `npm run build` - собирает frontend (Vite) и backend (esbuild)
- **Start**: `npm start` - запускает продакшен-версию сервера

### 2. Необходимые секреты

Перед деплоем убедитесь, что в Secrets настроен:
- `GEMINI_API_KEY` - ключ для Google Gemini API (для AI-чата и квизов)

### 3. Деплой через Replit UI

1. Нажмите кнопку **"Deploy"** в верхней части Replit
2. Выберите **"Autoscale Deployment"**
3. Проверьте что секреты настроены
4. Нажмите **"Deploy"**

### 4. Production Build

Команда `npm run build` создаёт:
- `dist/client/` - оптимизированный frontend (Vite production build)
- `dist/index.js` - bundled Express сервер (esbuild)

### 5. Что происходит при деплое

1. **Build phase**:
   - Vite собирает React/Preact приложение с минификацией
   - esbuild создаёт bundle Express сервера
   - Все ассеты оптимизируются

2. **Start phase**:
   - Запускается `node dist/index.js`
   - Express сервер раздаёт статические файлы из `dist/client`
   - API endpoints доступны на `/api/*`
   - Приложение слушает порт 5000

### 6. Оптимизации для продакшена

✅ **Включено:**
- Production builds с минификацией
- Tree-shaking неиспользуемого кода
- Code splitting для оптимальной загрузки
- Compression middleware в Express
- Environment-based конфигурация (NODE_ENV=production)

### 7. Мониторинг

После деплоя:
- Проверьте логи в Replit Dashboard
- Убедитесь что AI чат работает (тестируйте с GEMINI_API_KEY)
- Проверьте все языки (en, kz, ru)
- Протестируйте регистрацию на кружки

### 8. Важные заметки

⚠️ **База данных**: Проект использует in-memory storage (MemStorage). Данные НЕ сохраняются между перезапусками. Для продакшена рекомендуется:
- Включить PostgreSQL через Replit Database
- Запустить миграции: `npm run db:push`
- Обновить `server/storage.ts` для использования Drizzle ORM вместо MemStorage

⚠️ **Масштабирование**: Autoscale автоматически управляет ресурсами, но:
- Первый запрос после неактивности может быть медленнее (cold start)
- Для постоянной доступности рассмотрите Reserved VM deployment

## Миграция на PostgreSQL (рекомендуется для продакшена)

### Шаги:

1. **Создайте базу данных в Replit:**
   ```bash
   # База создаётся автоматически через Replit UI
   ```

2. **Запустите миграции:**
   ```bash
   npm run db:push
   ```

3. **Обновите код:**
   - В `server/index.ts` замените `storage` на Drizzle queries
   - Удалите `server/storage.ts` (MemStorage)
   - Используйте подготовленные схемы из `server/db/schema.ts`

4. **Переменные окружения:**
   - `DATABASE_URL` - автоматически предоставляется Replit

## Проверка продакшен билда локально

```bash
# Соберите проект
npm run build

# Запустите продакшен версию
npm start
```

Откройте http://localhost:5000 для проверки.

## Troubleshooting

**Проблема**: Build fails
- Проверьте TypeScript ошибки: `npm run check`
- Убедитесь что все зависимости установлены: `npm install`

**Проблема**: AI не работает
- Проверьте что `GEMINI_API_KEY` настроен в Secrets
- Проверьте логи для API errors

**Проблема**: Стили не применяются
- Очистите кэш билда: `rm -rf dist`
- Пересоберите: `npm run build`

## Контакты

Дворец школьников "DIGITAL URPAQ"
- Website: https://digitalurpaq.edu.kz
- Address: V438+J5W, ул. Таштинова, Петропавловск 150000
- Phone: Приемная: +7 (7152) 34-02-40, Ресепшн: +7 (7152) 50-17-03
