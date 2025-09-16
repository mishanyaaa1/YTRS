#!/bin/bash

# Скрипт для деплоя YTORSWEB на VPS
set -e

echo "🚀 Начинаем деплой YTORSWEB..."

# Проверяем, что мы в правильной директории
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Ошибка: docker-compose.yml не найден. Запустите скрипт из корневой директории проекта."
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo "⚠️  Файл .env не найден. Создаем из примера..."
    cp env.production.example .env
    echo "📝 Пожалуйста, отредактируйте файл .env и настройте переменные окружения"
    echo "   Особенно важно изменить:"
    echo "   - POSTGRES_PASSWORD"
    echo "   - JWT_SECRET"
    echo "   - ADMIN_USERNAME"
    echo "   - ADMIN_PASSWORD"
    echo "   - DOMAIN"
    echo "   - SSL_EMAIL"
    exit 1
fi

# Проверяем Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и Docker Compose."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose down

# Удаляем старые образы (опционально)
read -p "🗑️  Удалить старые образы? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down --rmi all
    docker system prune -f
fi

# Собираем и запускаем контейнеры
echo "🔨 Собираем и запускаем контейнеры..."
docker-compose up --build -d

# Ждем запуска базы данных
echo "⏳ Ждем запуска базы данных..."
sleep 10

# Проверяем статус контейнеров
echo "📊 Статус контейнеров:"
docker-compose ps

# Проверяем логи
echo "📋 Последние логи приложения:"
docker-compose logs --tail=20 app

echo "✅ Деплой завершен!"
echo "🌐 Приложение доступно по адресу: http://$(hostname -I | awk '{print $1}'):80"
echo "🔧 Для настройки SSL запустите: ./setup-ssl.sh"
echo "📊 Для просмотра логов: docker-compose logs -f"
