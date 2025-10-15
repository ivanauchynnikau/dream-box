# Настройка Supabase для DreamBox

## 🎯 Шаг 1: Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **Start your project** и войдите через GitHub
3. Нажмите **New project**
4. Заполните форму:
   - **Name**: `dreambox`
   - **Database Password**: создайте надежный пароль (сохраните его!)
   - **Region**: выберите ближайший регион (например, `Europe (Frankfurt)`)
5. Нажмите **Create new project**
6. Подождите ~2 минуты пока проект создастся

---

## 📊 Шаг 2: Создание таблицы в базе данных

1. В боковом меню выберите **Table Editor**
2. Нажмите **Create a new table**
3. Заполните форму:
   - **Name**: `dreams`
   - Включите опцию **Enable Row Level Security (RLS)**

4. Добавьте следующие колонки (нажмите **Add column** для каждой):

| Name | Type | Default Value | Primary | Extra |
|------|------|---------------|---------|-------|
| `id` | uuid | `gen_random_uuid()` | ✅ Primary | - |
| `created_at` | timestamptz | `now()` | - | - |
| `updated_at` | timestamptz | `now()` | - | - |
| `user_id` | uuid | - | - | Foreign Key → auth.users |
| `dream_name` | text | - | - | - |
| `image_url` | text | `''` | - | - |
| `target_amount` | numeric | - | - | - |
| `time_value` | int4 | - | - | - |
| `time_unit` | text | - | - | - |
| `saved_amount` | numeric | `0` | - | - |
| `start_date` | timestamptz | `now()` | - | - |
| `last_saved_date` | text | - | - | nullable |

5. Нажмите **Save**

---

## 🔐 Шаг 3: Настройка Row Level Security (RLS)

1. В **Table Editor** найдите таблицу `dreams`
2. Нажмите на три точки (...) → **View policies**
3. Нажмите **New policy**
4. Выберите **Create policy from scratch**

### Политика 1: SELECT (чтение)
```sql
CREATE POLICY "Users can view own dreams"
ON dreams FOR SELECT
USING (auth.uid() = user_id);
```

### Политика 2: INSERT (создание)
```sql
CREATE POLICY "Users can create own dreams"
ON dreams FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Политика 3: UPDATE (обновление)
```sql
CREATE POLICY "Users can update own dreams"
ON dreams FOR UPDATE
USING (auth.uid() = user_id);
```

### Политика 4: DELETE (удаление)
```sql
CREATE POLICY "Users can delete own dreams"
ON dreams FOR DELETE
USING (auth.uid() = user_id);
```

**Или создайте все политики одной командой через SQL Editor:**

```sql
-- Включить RLS
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;

-- Политики
CREATE POLICY "Users can view own dreams"
  ON dreams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own dreams"
  ON dreams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dreams"
  ON dreams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dreams"
  ON dreams FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🔑 Шаг 4: Получение API ключей

1. В боковом меню выберите **Project Settings** (иконка шестеренки)
2. Выберите **API**
3. Скопируйте следующие значения:

   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** key (длинный ключ, начинается с `eyJ...`)

---

## 💻 Шаг 5: Настройка локального окружения

1. Создайте файл `.env` в корне проекта:

```env
VITE_SUPABASE_URL=ваш_project_url
VITE_SUPABASE_ANON_KEY=ваш_anon_key
```

2. Проверьте, что `.env` добавлен в `.gitignore` (уже должен быть)

---

## 🔐 Шаг 6: Настройка Authentication

1. В боковом меню выберите **Authentication**
2. Перейдите в **Providers**
3. Найдите **Email** и включите его:
   - **Enable Email provider**: ✅
   - **Confirm email**: ⬜ (можно отключить для разработки)
4. Нажмите **Save**

**Рекомендуемые настройки для разработки:**
- **Settings** → **Auth** → **Email Auth**:
  - **Enable email confirmations**: Отключите для удобства разработки
  - **Secure email change**: Включите для безопасности

---

## 🚀 Шаг 7: Настройка GitHub Secrets (для деплоя)

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret** для каждого:

   - **Name**: `VITE_SUPABASE_URL`  
     **Value**: ваш Project URL
   
   - **Name**: `VITE_SUPABASE_ANON_KEY`  
     **Value**: ваш anon public key

---

## ✅ Проверка настройки

Запустите проект локально:

```bash
npm run dev
```

Вы должны увидеть:
1. Страницу **Регистрации** при первом заходе
2. Возможность создать аккаунт
3. Автоматический вход после регистрации
4. Страницу создания мечты

---

## 🔧 Устранение проблем

### Ошибка: "Отсутствуют переменные окружения Supabase"
- Проверьте, что файл `.env` создан в корне проекта
- Убедитесь, что переменные начинаются с `VITE_`
- Перезапустите dev-сервер после создания `.env`

### Ошибка: "Invalid API key"
- Проверьте правильность скопированных ключей
- Убедитесь, что нет лишних пробелов в `.env`

### Ошибка: "Row Level Security policy violation"
- Убедитесь, что все политики RLS созданы
- Проверьте, что таблица `dreams` имеет колонку `user_id`

### Данные не сохраняются
- Откройте **Table Editor** → **dreams** и проверьте структуру таблицы
- Проверьте консоль браузера на ошибки
- Убедитесь, что вы авторизованы

---

## 📚 Дополнительные ресурсы

- [Документация Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 Готово!

После настройки ваше приложение:
- ✅ Имеет авторизацию по email/password
- ✅ Хранит данные в облачной базе данных
- ✅ Защищает данные пользователей через RLS
- ✅ Автоматически деплоится на GitHub Pages
- ✅ Синхронизируется между устройствами

