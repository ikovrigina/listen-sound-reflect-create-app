# 🚀 Инструкция по настройке Listen.Sound.Reflect.Create

## 📋 Пошаговая настройка

### 1. **Создание проекта в Supabase**

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **"Start your project"**
3. Войдите через GitHub
4. Создайте новый проект:
   - **Name:** `listen-sound-reflect-create`
   - **Database Password:** создайте надежный пароль (сохраните!)
   - **Region:** выберите ближайший к вам

### 2. **Создание базы данных**

1. В Supabase перейдите в **SQL Editor**
2. Нажмите **"New query"**
3. Скопируйте содержимое файла `create_database.sql`
4. Вставьте в SQL Editor и нажмите **"Run"**

### 3. **Получение API ключей**

1. В Supabase перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: `https://abcdefgh.supabase.co`)
   - **anon public key** (длинная строка)

### 4. **Настройка переменных окружения**

1. **Скопируйте файл `env.example` в `.env`:**
```bash
cp env.example .env
```

2. **Откройте файл `.env` и заполните своими значениями:**

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co        # ← Замените на ваш Project URL
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here  # ← Замените на ваш anon key

# Telegram Bot Configuration  
TELEGRAM_BOT_TOKEN=1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA  # ← Замените на ваш токен от @BotFather
TELEGRAM_BOT_USERNAME=ListenSoundReflectCreateBot

# Deployment URLs
VERCEL_URL=https://your-project.vercel.app           # ← Замените на ваш Vercel URL
```

**ВАЖНО:** Файл `.env` содержит секретные ключи и НЕ должен попадать в Git!

### 5. **Создание Storage Bucket для аудио**

1. В Supabase перейдите в **Storage**
2. Нажмите **"New bucket"**
3. Создайте bucket с именем `audio`
4. Установите **Public bucket: true**

### 6. **Настройка Storage Policies**

В **SQL Editor** выполните:

```sql
-- Политика для загрузки аудио файлов
CREATE POLICY "Users can upload audio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Политика для просмотра аудио файлов
CREATE POLICY "Anyone can view public audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');
```

### 7. **Загрузка на Vercel**

1. Переименуйте `index-with-supabase.html` в `index.html`
2. Создайте новый архив с файлами:
   - `index.html`
   - `config.js`
   - `.env` (ваш файл с ключами)
3. Загрузите на Vercel

**Альтернативно:** Настройте переменные окружения в Vercel Dashboard:
- Перейдите в Settings → Environment Variables
- Добавьте все переменные из вашего `.env` файла

### 8. **Обновление Telegram бота**

1. Откройте @BotFather в Telegram
2. Отправьте `/myapps`
3. Выберите ваш бот
4. Обновите **Web App URL** на новый Vercel URL

## ✅ Проверка работы

После настройки:

1. **Откройте ваш Mini App** в Telegram
2. **Проверьте статус подключения** к базе данных (должно быть зеленое сообщение)
3. **Нажмите "Listen"** - должен загрузиться случайный скор из базы
4. **Пройдите полный цикл** Listen → Sound → Reflect → Create
5. **Сохраните капсулу** - она должна сохраниться в Supabase

## 🔧 Устранение неполадок

### Ошибка "Configuration errors"
- Проверьте, что все значения в `config.js` заменены на реальные
- Убедитесь, что URL не содержит `your-project` или `your-anon-key`

### Ошибка "Database connection failed"
- Проверьте правильность SUPABASE_URL и SUPABASE_ANON_KEY
- Убедитесь, что проект в Supabase активен

### Ошибка при сохранении капсулы
- Проверьте, что SQL скрипт выполнен полностью
- Убедитесь, что RLS политики настроены правильно

### Не работает загрузка аудио
- Проверьте, что Storage bucket `audio` создан
- Убедитесь, что Storage policies настроены

## 📁 Структура файлов

```
mini-app-simple/
├── index.html                 # Основное приложение (переименованный index-with-supabase.html)
├── config.js                  # Конфигурация приложения
├── create_database.sql        # SQL скрипт для создания БД
├── DATABASE_STRUCTURE.md      # Документация структуры БД
└── SETUP_INSTRUCTIONS.md      # Эта инструкция
```

## 🎯 Следующие шаги

После успешной настройки можно:

1. **Добавить транскрипцию аудио** (OpenAI Whisper API)
2. **Улучшить UI/UX** дизайн
3. **Добавить аналитику** и статистику
4. **Создать систему тегов** для скоров
5. **Добавить социальные функции**

---

**Нужна помощь?** Проверьте консоль браузера на наличие ошибок и следуйте инструкциям по устранению неполадок выше.
