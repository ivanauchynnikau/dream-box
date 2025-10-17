# 🌐 Настройка домена my-dreambox.ru

## Быстрая настройка

### 1. Настройка DNS у регистратора домена

Зайдите в панель управления DNS у вашего регистратора домена (где купили `my-dreambox.ru`) и добавьте следующие записи:

#### Вариант A: Через A-записи (рекомендуется)

Добавьте 4 A-записи, указывающие на IP-адреса GitHub Pages:

```
Тип    Имя    Значение
A      @      185.199.108.153
A      @      185.199.109.153
A      @      185.199.110.153
A      @      185.199.111.153
```

#### Вариант B: Через CNAME (альтернатива)

Если используете поддомен (например, `www.my-dreambox.ru`):

```
Тип    Имя    Значение
CNAME  www    <ваш-username>.github.io.
```

#### Для поддержки www и основного домена:

```
# A-записи для основного домена
A      @      185.199.108.153
A      @      185.199.109.153
A      @      185.199.110.153
A      @      185.199.111.153

# CNAME для www
CNAME  www    <ваш-username>.github.io.
```

---

### 2. Настройка GitHub Pages

1. Откройте репозиторий `dream-box` на GitHub
2. Перейдите в **Settings** → **Pages**
3. В разделе **Custom domain** введите: `my-dreambox.ru`
4. Нажмите **Save**
5. ✅ Убедитесь, что включена опция **Enforce HTTPS** (через 24 часа после настройки DNS)

---

### 3. Деплой изменений

После настройки DNS и GitHub Pages выполните:

```bash
cd /home/ivan/work/dream-box
git add -A
git commit -m "Configure custom domain my-dreambox.ru"
git push
```

GitHub Actions автоматически задеплоит изменения.

---

## 🔍 Проверка настройки

### 1. Проверка DNS (может занять до 24-48 часов)

```bash
# Проверка A-записей
dig my-dreambox.ru +noall +answer

# Ожидаемый результат:
# my-dreambox.ru.  3600  IN  A  185.199.108.153
# my-dreambox.ru.  3600  IN  A  185.199.109.153
# my-dreambox.ru.  3600  IN  A  185.199.110.153
# my-dreambox.ru.  3600  IN  A  185.199.111.153
```

### 2. Проверка CNAME файла

```bash
curl https://my-dreambox.ru/CNAME
# Должно вывести: my-dreambox.ru
```

### 3. Проверка работы сайта

Откройте в браузере:
- ✅ `https://my-dreambox.ru/`
- ✅ `https://www.my-dreambox.ru/` (если настроили www)

---

## 📋 Популярные регистраторы доменов

### REG.RU

1. Перейдите на [reg.ru](https://www.reg.ru/)
2. Войдите в личный кабинет
3. Выберите домен `my-dreambox.ru`
4. Перейдите в **Управление доменом** → **DNS-серверы и зона**
5. Добавьте A-записи как указано выше

### Timeweb / Beget / другие

1. Войдите в панель управления
2. Найдите раздел **DNS** или **Управление DNS**
3. Добавьте A-записи для основного домена (`@`)
4. Сохраните изменения

---

## ⚠️ Частые проблемы

### DNS не обновляется
- **Решение:** Подождите 24-48 часов для полного распространения DNS

### Ошибка "DNS check unsuccessful"
- **Решение:** Убедитесь, что A-записи правильно добавлены у регистратора
- Проверьте через `dig my-dreambox.ru`

### HTTPS не работает
- **Решение:** 
  1. Подождите 24 часа после настройки DNS
  2. В GitHub Settings → Pages включите **Enforce HTTPS**
  3. GitHub автоматически выпустит SSL сертификат

### Сайт не загружается после настройки
- **Решение:** Очистите кеш браузера (Ctrl+Shift+R)
- Проверьте, что в GitHub Pages установлен домен `my-dreambox.ru`

---

## 📚 Дополнительные ресурсы

- [GitHub Docs: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Проверка DNS записей](https://www.whatsmydns.net/)

---

## ✅ Чеклист настройки

- [ ] Добавлены A-записи в DNS у регистратора
- [ ] Настроен Custom domain в GitHub Settings → Pages
- [ ] Создан файл `public/CNAME` с доменом
- [ ] Обновлены все URL в `index.html`, `sitemap.xml`, `robots.txt`
- [ ] Изменен `vite.config.ts` (base: '/')
- [ ] Выполнен git push
- [ ] Проверка: открывается https://my-dreambox.ru/
- [ ] Включен Enforce HTTPS в GitHub Pages

---

**После выполнения всех шагов ваш сайт будет доступен по адресу:**

## 🎉 https://my-dreambox.ru/

