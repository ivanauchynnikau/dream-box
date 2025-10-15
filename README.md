# Dream Weaver Vault

Приложение для отслеживания накоплений на вашу мечту.

## Технологии

Проект построен с использованием:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Разработка

Для работы с проектом локально необходимо иметь установленный Node.js & npm - [установка через nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Следуйте этим шагам:

```sh
# Шаг 1: Клонируйте репозиторий
git clone <YOUR_GIT_URL>

# Шаг 2: Перейдите в директорию проекта
cd dream-weaver-vault

# Шаг 3: Установите зависимости
npm i

# Шаг 4: Запустите сервер разработки
npm run dev
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

1. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в **Settings** → **Pages**
   - В разделе **Source** выберите **GitHub Actions**

2. **Настройте права для GitHub Actions:**
   - Перейдите в **Settings** → **Actions** → **General**
   - В разделе **Workflow permissions** выберите **Read and write permissions**
   - Поставьте галочку **Allow GitHub Actions to create and approve pull requests**
   - Нажмите **Save**

3. **Сделайте push в основную ветку:**
   ```sh
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

4. **Дождитесь завершения деплоя:**
   - Перейдите во вкладку **Actions** в вашем репозитории
   - Дождитесь успешного завершения workflow

После успешного деплоя сайт будет доступен по адресу:
```
https://[ваш-username].github.io/dream-weaver-vault/
```

### Автоматический деплой

После настройки, каждый раз когда вы делаете push в ветку `main` или `master`, GitHub Actions автоматически:
- Устанавливает зависимости
- Собирает проект (`npm run build`)
- Деплоит его на GitHub Pages

### Важно

- Репозиторий должен быть **публичным** для работы GitHub Pages
- Проект использует HashRouter для корректной работы маршрутизации на GitHub Pages
- Файл `.github/workflows/deploy.yml` содержит конфигурацию автоматического деплоя

### Устранение проблем

Если возникли проблемы с деплоем, смотрите подробную инструкцию в файле [DEPLOYMENT.md](DEPLOYMENT.md), где описаны все возможные проблемы и их решения.
