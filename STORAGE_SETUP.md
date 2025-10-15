# Настройка Supabase Storage для загрузки фото

## 📸 Зачем это нужно?

Теперь пользователи могут загружать фото мечты прямо с устройства, а не только по ссылке!

---

## 🔧 Шаги настройки:

### 1️⃣ Создание Storage Bucket

1. Откройте ваш проект в [Supabase Dashboard](https://app.supabase.com/)
2. В боковом меню выберите **Storage**
3. Нажмите **Create a new bucket**
4. Заполните форму:
   - **Name**: `dream-images`
   - **Public bucket**: ✅ **Включите** (чтобы изображения были доступны)
   - **File size limit**: `5MB` (опционально)
   - **Allowed MIME types**: `image/*` (опционально)
5. Нажмите **Create bucket**

---

### 2️⃣ Настройка политик безопасности

После создания bucket нужно настроить политики доступа:

#### Вариант A: Через интерфейс

1. В списке buckets найдите `dream-images`
2. Нажмите на три точки (...) → **Policies**
3. Нажмите **New policy**

**Создайте 3 политики:**

**Политика 1: INSERT (загрузка)**
- **Policy name**: `Users can upload own images`
- **Target roles**: `authenticated`
- **Operation**: `INSERT`
- **SQL Definition**:
```sql
((bucket_id = 'dream-images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))
```

**Политика 2: SELECT (просмотр)**
- **Policy name**: `Public images are accessible`
- **Target roles**: `public`
- **Operation**: `SELECT`
- **SQL Definition**:
```sql
(bucket_id = 'dream-images'::text)
```

**Политика 3: DELETE (удаление)**
- **Policy name**: `Users can delete own images`
- **Target roles**: `authenticated`
- **Operation**: `DELETE`
- **SQL Definition**:
```sql
((bucket_id = 'dream-images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))
```

#### Вариант B: Через SQL Editor (быстрее!)

Откройте **SQL Editor** и выполните:

```sql
-- Политика: загрузка только в свою папку
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dream-images' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

-- Политика: публичный просмотр
CREATE POLICY "Public images are accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dream-images');

-- Политика: удаление только своих файлов
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'dream-images' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);
```

---

### 3️⃣ Проверка настройки

После настройки:

1. Запустите приложение: `npm run dev`
2. Войдите в аккаунт
3. Создайте/отредактируйте мечту
4. Во вкладке **"Загрузить файл"** выберите изображение
5. Нажмите **"Начать копить"**

Если изображение загрузилось - все работает! ✅

---

## 📁 Структура хранения

Файлы хранятся в следующей структуре:

```
dream-images/
├── user-id-1/
│   ├── 1699999999999.jpg
│   └── 1700000000000.png
├── user-id-2/
│   └── 1700000011111.jpg
└── ...
```

Каждый пользователь может загружать только в свою папку (user_id).

---

## 🎨 Возможности

### Поддерживаемые форматы:
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF
- ✅ WebP
- ✅ SVG

### Ограничения:
- Максимальный размер: **5 MB**
- Только изображения

### Функции:
- ✅ Превью перед загрузкой
- ✅ Индикатор загрузки
- ✅ Проверка размера и типа файла
- ✅ Уникальные имена файлов
- ✅ Организация по пользователям

---

## 🔍 Просмотр загруженных файлов

Чтобы увидеть загруженные файлы:

1. **Storage** → **dream-images**
2. Выберите папку пользователя (user ID)
3. Увидите все загруженные изображения

Можете:
- Просмотреть изображение
- Скачать
- Удалить (если нужно)
- Скопировать публичный URL

---

## 🆘 Устранение проблем

### Ошибка: "Не удалось загрузить изображение"

**Причины:**
1. Bucket не создан или называется по-другому
2. Политики безопасности не настроены
3. Bucket не публичный

**Решение:**
- Проверьте название bucket: должно быть точно `dream-images`
- Убедитесь, что bucket публичный
- Проверьте политики в разделе Policies

### Ошибка: "Размер файла не должен превышать 5MB"

**Решение:**
- Используйте изображение меньшего размера
- Сожмите изображение через онлайн-сервисы (tinypng.com)

### Файлы не отображаются

**Решение:**
- Проверьте политику SELECT для публичного доступа
- Убедитесь, что bucket публичный
- Попробуйте открыть URL изображения в браузере

---

## 🔗 Полезные ссылки

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

---

## ✅ Готово!

После настройки Storage пользователи смогут:
- 📤 Загружать фото с устройства
- 🔗 Или использовать ссылку на фото
- 👁️ Видеть превью перед сохранением
- 🔄 Менять фото в любой момент

