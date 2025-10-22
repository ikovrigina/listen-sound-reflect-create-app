# 🤖 Настройка Telegram Bot для аудио записи

## Проблема
Mini App не может надежно записывать аудио из-за ограничений браузера в Telegram WebView.

## Решение: Telegram Bot
Создаем отдельного бота, который:
- Принимает голосовые сообщения от пользователей
- Автоматически сохраняет их в Supabase Storage
- Интегрируется с Mini App через базу данных

## 🚀 Быстрый старт

### 1. Создание бота
1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot`
3. Выберите имя: `Listen Sound Reflect Create Audio Bot`
4. Выберите username: `ListenSoundReflectCreateAudioBot`
5. Сохраните токен бота

### 2. Настройка переменных окружения
Добавьте в ваш `.env` файл:
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEBAPP_URL=https://listen-sound-reflect-create.vercel.app/

# Supabase (уже должны быть)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Установка зависимостей
```bash
pip install -r requirements-bot.txt
```

### 4. Запуск бота
```bash
python telegram-bot.py
```

## 📱 Как использовать

### Для пользователей:
1. Найдите вашего бота в Telegram
2. Нажмите `/start`
3. Откройте Mini App
4. Когда нужно записать аудио - отправьте голосовое сообщение боту
5. Бот автоматически сохранит аудио в Supabase

### Интеграция с Mini App:
Mini App может проверять новые аудио файлы:
```javascript
// Проверить новые аудио файлы пользователя
async function checkForNewAudio(userId) {
    const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
    
    if (data && data.length > 0) {
        const latestAudio = data[0];
        // Использовать аудио в приложении
        return latestAudio;
    }
}
```

## 🔧 Деплой бота

### Heroku
1. Создайте `Procfile`:
```
worker: python telegram-bot.py
```

2. Деплой:
```bash
git add .
git commit -m "Add Telegram bot"
git push heroku main
```

### Railway/Render
1. Подключите GitHub репозиторий
2. Установите переменные окружения
3. Запустите как Python приложение

### VPS/Сервер
```bash
# Установка в фоне
nohup python telegram-bot.py &

# Или с systemd
sudo systemctl enable telegram-bot
sudo systemctl start telegram-bot
```

## 🎯 Функции бота

### ✅ Реализовано:
- Прием голосовых сообщений
- Сохранение в Supabase Storage
- Метаданные в базе данных
- Интеграция с Mini App
- Обработка ошибок

### 🔄 Планируется:
- Транскрипция аудио в текст
- Анализ ключевых слов
- Уведомления о новых аудио
- Статистика использования

## 🛠️ Альтернативные решения

### 1. Webhook интеграция
Вместо постоянно работающего бота, используйте webhook:
```python
from flask import Flask, request
app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    update = request.get_json()
    # Обработка аудио
    return 'OK'
```

### 2. Serverless функции
Деплой бота как serverless функции на Vercel/Netlify.

### 3. Улучшенный WebRTC
Попробовать более продвинутые методы записи в браузере:
```javascript
// Более надежная запись
const constraints = {
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
        channelCount: 1
    }
};
```

## 🔐 Безопасность

- Бот токен держите в секрете
- Используйте HTTPS для webhook
- Валидируйте размер аудио файлов
- Ограничьте доступ к Supabase Storage

## 📊 Мониторинг

Добавьте логирование:
```python
import logging
logging.basicConfig(level=logging.INFO)

# Метрики
total_audio_processed = 0
errors_count = 0
```

## 🎵 Готово!

Теперь у вас есть полная интеграция:
- **Mini App** - основной интерфейс
- **Telegram Bot** - надежная запись аудио
- **Supabase** - хранение и синхронизация

Пользователи могут записывать аудио через бота, а Mini App будет автоматически получать доступ к сохраненным файлам!
