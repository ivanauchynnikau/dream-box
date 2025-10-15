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

## Деплой

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

При каждом push в ветку `main` или `master`, проект автоматически собирается и деплоится.

Подробная инструкция по настройке и деплою находится в файле [DEPLOYMENT.md](DEPLOYMENT.md).
