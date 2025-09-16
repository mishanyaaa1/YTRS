# 🌐 YTORSWEB - Готов к деплою на VPS

## 📦 Что включено

### ✅ Готовая инфраструктура:
- **Docker** контейнеризация
- **PostgreSQL** база данных
- **Redis** кэширование
- **Nginx** reverse proxy
- **SSL** сертификаты (Let's Encrypt)
- **Автоматические бэкапы**

### ✅ Скрипты автоматизации:
- `deploy.sh` - основной деплой
- `setup-ssl.sh` - настройка SSL
- `backup.sh` - резервное копирование

### ✅ Конфигурации:
- `docker-compose.yml` - оркестрация сервисов
- `nginx/` - конфигурация веб-сервера
- `env.production.example` - переменные окружения

## 🚀 Быстрый старт

1. **Подготовьте VPS** (Ubuntu 20.04+, 2GB RAM, 20GB диск)
2. **Установите Docker** и Docker Compose
3. **Клонируйте проект** и настройте `.env`
4. **Запустите** `./deploy.sh`
5. **Настройте SSL** `./setup-ssl.sh`

Подробная инструкция: [QUICK_START.md](QUICK_START.md)

## 📋 Требования VPS

- **ОС**: Ubuntu 20.04+ (рекомендуется)
- **RAM**: минимум 2GB, рекомендуется 4GB
- **CPU**: 2 ядра
- **Диск**: 20GB+ свободного места
- **Сеть**: статический IP
- **Порты**: 80, 443, 22

## 🔧 Технический стек

### Backend:
- Node.js + Express
- PostgreSQL
- Redis
- JWT аутентификация
- Multer (загрузка файлов)

### Frontend:
- React 19
- Vite
- React Router
- Framer Motion
- Styled Components

### Инфраструктура:
- Docker & Docker Compose
- Nginx
- Let's Encrypt SSL
- Automated backups

## 📁 Структура проекта

```
YTORSWEB/
├── src/                    # React приложение
├── server/                 # Express сервер
├── nginx/                  # Nginx конфигурация
├── docker-compose.yml      # Docker оркестрация
├── Dockerfile             # Docker образ
├── deploy.sh              # Скрипт деплоя
├── setup-ssl.sh           # SSL настройка
├── backup.sh              # Резервное копирование
├── .env.production        # Переменные окружения
└── DEPLOYMENT.md          # Подробная инструкция
```

## 🔒 Безопасность

- HTTPS принудительно
- Защищенные cookies
- CORS настройки
- Rate limiting
- Helmet.js защита
- Изолированные контейнеры

## 📊 Мониторинг

- Логи через Docker
- Health checks
- Автоматические бэкапы
- Обновление сертификатов

## 🎯 Готовые функции

- ✅ Каталог товаров
- ✅ Корзина покупок
- ✅ Админ панель
- ✅ Управление заказами
- ✅ Загрузка изображений
- ✅ SEO оптимизация
- ✅ Адаптивный дизайн
- ✅ Мобильная версия

## 📞 Поддержка

При проблемах с деплоем:
1. Проверьте [DEPLOYMENT.md](DEPLOYMENT.md)
2. Проверьте логи: `docker-compose logs -f`
3. Проверьте статус: `docker-compose ps`

---

**🚀 Готов к продакшену! Просто следуйте инструкциям в QUICK_START.md**
