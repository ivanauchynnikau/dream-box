# DreamBox

Приложение для отслеживания накоплений на вашу мечту с авторизацией и облачным хранением данных.

## ✨ Возможности

- 🔐 Авторизация и регистрация пользователей
- ☁️ Облачное хранение данных в Supabase
- 📊 Отслеживание прогресса накоплений
- 💡 Умные рекомендации по ежедневным накоплениям
- 📱 Адаптивный дизайн для всех устройств
- 🔄 Синхронизация между устройствами
- 🚀 Автоматический деплой на GitHub Pages

## Технологии

Проект построен с использованием:

- Vite
- TypeScript
- React
- Supabase (Authentication + Database)
- shadcn-ui
- Tailwind CSS

## Разработка

### Требования

- Node.js >= 18.0.0 - [установка через nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Аккаунт на [Supabase](https://supabase.com) (бесплатный)

### Быстрый старт

```sh
# Шаг 1: Клонируйте репозиторий
git clone <YOUR_GIT_URL>

# Шаг 2: Перейдите в директорию проекта
cd dreambox

# Шаг 3: Установите зависимости
npm i

# Шаг 4: Настройте Supabase (см. SUPABASE_SETUP.md)
# Создайте файл .env с вашими Supabase credentials

# Шаг 5: Запустите сервер разработки
npm run dev
```

### 🔧 Настройка Supabase

Подробная инструкция по настройке Supabase находится в файле [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

Краткая версия:
1. Создайте проект на [supabase.com](https://supabase.com)
2. Создайте таблицу `dreams` (см. инструкцию)
3. Настройте Row Level Security
4. Скопируйте API ключи в `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Сборка

Для создания production сборки выполните:

```sh
npm run build
```

Для предпросмотра production сборки:

```sh
npm run preview
```

## Деплой на GitHub Pages

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

### Быстрый старт

1. **Добавьте Supabase Secrets в GitHub:**
   - Перейдите в **Settings** → **Secrets and variables** → **Actions**
   - Добавьте секреты:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

2. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в **Settings** → **Pages**
   - В разделе **Source** выберите **GitHub Actions**

3. **Настройте права для GitHub Actions:**
   - Перейдите в **Settings** → **Actions** → **General**
   - В разделе **Workflow permissions** выберите **Read and write permissions**
   - Поставьте галочку **Allow GitHub Actions to create and approve pull requests**
   - Нажмите **Save**

4. **Сделайте push в основную ветку:**
   ```sh
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

5. **Дождитесь завершения деплоя:**
   - Перейдите во вкладку **Actions** в вашем репозитории
   - Дождитесь успешного завершения workflow

После успешного деплоя сайт будет доступен по адресу:
```
https://[ваш-username].github.io/dream-box/
```

### Автоматический деплой

После настройки, каждый раз когда вы делаете push в ветку `main` или `master`, GitHub Actions автоматически:
- Устанавливает зависимости
- Использует Supabase credentials из GitHub Secrets
- Собирает проект (`npm run build`)
- Деплоит его на GitHub Pages

### Важно

- Репозиторий должен быть **публичным** для работы GitHub Pages
- Проект использует HashRouter для корректной работы маршрутизации на GitHub Pages
- Файл `.github/workflows/deploy.yml` содержит конфигурацию автоматического деплоя
- **Обязательно добавьте Supabase Secrets** в настройках репозитория (см. выше)

### Файлы документации

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Полная инструкция по настройке Supabase
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Устранение проблем с деплоем на GitHub Pages

## 🔐 Безопасность

- Никогда не коммитьте файл `.env` в Git
- Supabase API ключи хранятся как GitHub Secrets для деплоя
- Row Level Security (RLS) защищает данные пользователей в базе
- Каждый пользователь видит только свои мечты
