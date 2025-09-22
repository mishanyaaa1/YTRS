# YTORSWEB Server

Сервер для проекта YTORSWEB, работающий с PostgreSQL.

## 🗄️ База данных

Проект использует **PostgreSQL** как основную базу данных.

### Подключение к базе данных

**Настройки в файле `.env`:**
```env
DATABASE_TYPE=postgres
POSTGRES_USER=postgres
POSTGRES_HOST=localhost
POSTGRES_DB=ytorsweb
POSTGRES_PASSWORD=ваш_пароль
POSTGRES_PORT=5432
```

### Просмотр базы данных

**Через pgAdmin 4:**
1. Откройте pgAdmin 4
2. Создайте подключение:
   - Host: `localhost`
   - Port: `5432`
   - Database: `ytorsweb`
   - Username: `postgres`
   - Password: ваш пароль

**Через командную строку:**
```bash
# Добавить PostgreSQL в PATH
$env:PATH += ";X:\PostgreSQL\bin"

# Подключиться к базе
psql -U postgres -d ytorsweb
```

## 🚀 Запуск

```bash
npm start
```

## 📊 Данные

- **102 товара** в каталоге
- **3 вездехода**
- **9 категорий** и **55 подкатегорий**
- **14 брендов**
- **39 клиентов**
- **1 заказ**

## 🔄 Переключение БД

Для переключения между SQLite и PostgreSQL измените в `.env`:
```env
# PostgreSQL
DATABASE_TYPE=postgres

# SQLite (если нужно вернуться)
DATABASE_TYPE=sqlite
```

## 📁 Структура

- `index.js` - основной сервер
- `db_switch.js` - переключатель баз данных
- `db_postgres.js` - модуль PostgreSQL
- `db.js` - модуль SQLite (для совместимости)
- `load_env.js` - загрузка переменных окружения
- `postgres_schema.sql` - схема PostgreSQL
- `postgres_init_data.sql` - начальные данные
- `.env` - настройки (создать из `env.example`)
