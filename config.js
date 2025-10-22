// ========================================
// Listen.Sound.Reflect.Create - Configuration
// ========================================

// Функция для загрузки переменных окружения из .env файла (для браузера)
async function loadEnvVariables() {
    try {
        // Попытка загрузить .env файл (если доступен)
        const response = await fetch('.env');
        if (response.ok) {
            const envText = await response.text();
            const envVars = {};
            
            envText.split('\n').forEach(line => {
                line = line.trim();
                if (line && !line.startsWith('#')) {
                    const [key, ...valueParts] = line.split('=');
                    if (key && valueParts.length > 0) {
                        envVars[key.trim()] = valueParts.join('=').trim();
                    }
                }
            });
            
            return envVars;
        }
    } catch (error) {
        console.warn('Could not load .env file:', error);
    }
    
    return {};
}

// Базовая конфигурация (fallback значения)
const CONFIG = {
    // Supabase Configuration
    SUPABASE: {
        URL: 'https://your-project.supabase.co',
        ANON_KEY: 'your-anon-key-here',
        SERVICE_ROLE_KEY: 'your-service-role-key-here' // Только для серверной части
    },
    
    // Telegram Bot Configuration
    TELEGRAM: {
        BOT_TOKEN: 'your-bot-token-here', // Только для серверной части
        BOT_USERNAME: 'ListenSoundReflectCreateBot',
        WEBAPP_URL: 'https://t.me/ListenSoundReflectCreateBot/LSRC'
    },
    
    // Deployment URLs
    DEPLOYMENT: {
        VERCEL_URL: 'https://your-project.vercel.app',
        DOMAIN: 'your-custom-domain.com' // Если есть
    },
    
    // Audio Configuration
    AUDIO: {
        MAX_FILE_SIZE_MB: 10,
        ALLOWED_FORMATS: ['webm', 'wav', 'mp3', 'm4a'],
        STORAGE_BUCKET: 'audio',
        MAX_DURATION_SECONDS: 300 // 5 минут
    },
    
    // Application Settings
    APP: {
        DEFAULT_LANGUAGE: 'en',
        ENABLE_ANALYTICS: false,
        DEBUG_MODE: false,
        VERSION: '1.0.0'
    },
    
    // Security Settings
    SECURITY: {
        CORS_ORIGINS: [
            'https://your-project.vercel.app',
            'https://t.me'
        ],
        RATE_LIMIT_PER_MINUTE: 60
    },
    
    // Optional: External Services
    EXTERNAL_SERVICES: {
        OPENAI_API_KEY: '', // Для транскрипции аудио
        GOOGLE_CLOUD_API_KEY: '', // Альтернатива для speech-to-text
        ENABLE_TRANSCRIPTION: false
    }
};

// Функция для получения конфигурации с проверкой окружения
async function getConfig(envVars = {}) {
    // Объединяем переменные окружения с базовой конфигурацией
    const config = {
        ...CONFIG,
        SUPABASE: {
            URL: envVars.SUPABASE_URL || CONFIG.SUPABASE.URL,
            ANON_KEY: envVars.SUPABASE_ANON_KEY || CONFIG.SUPABASE.ANON_KEY,
            SERVICE_ROLE_KEY: envVars.SUPABASE_SERVICE_ROLE_KEY || CONFIG.SUPABASE.SERVICE_ROLE_KEY
        },
        TELEGRAM: {
            BOT_TOKEN: envVars.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM.BOT_TOKEN,
            BOT_USERNAME: envVars.TELEGRAM_BOT_USERNAME || CONFIG.TELEGRAM.BOT_USERNAME,
            WEBAPP_URL: envVars.TELEGRAM_WEBAPP_URL || CONFIG.TELEGRAM.WEBAPP_URL
        },
        DEPLOYMENT: {
            VERCEL_URL: envVars.VERCEL_URL || CONFIG.DEPLOYMENT.VERCEL_URL,
            DOMAIN: envVars.DOMAIN || CONFIG.DEPLOYMENT.DOMAIN
        },
        AUDIO: {
            ...CONFIG.AUDIO,
            MAX_FILE_SIZE_MB: parseInt(envVars.MAX_AUDIO_FILE_SIZE_MB) || CONFIG.AUDIO.MAX_FILE_SIZE_MB,
            MAX_DURATION_SECONDS: parseInt(envVars.MAX_AUDIO_DURATION_SECONDS) || CONFIG.AUDIO.MAX_DURATION_SECONDS,
            ALLOWED_FORMATS: envVars.ALLOWED_AUDIO_FORMATS ? envVars.ALLOWED_AUDIO_FORMATS.split(',') : CONFIG.AUDIO.ALLOWED_FORMATS,
            STORAGE_BUCKET: envVars.AUDIO_STORAGE_BUCKET || CONFIG.AUDIO.STORAGE_BUCKET
        },
        APP: {
            ...CONFIG.APP,
            DEFAULT_LANGUAGE: envVars.DEFAULT_LANGUAGE || CONFIG.APP.DEFAULT_LANGUAGE,
            ENABLE_ANALYTICS: envVars.ENABLE_ANALYTICS === 'true' || CONFIG.APP.ENABLE_ANALYTICS,
            DEBUG_MODE: envVars.DEBUG_MODE === 'true' || CONFIG.APP.DEBUG_MODE,
            VERSION: envVars.APP_VERSION || CONFIG.APP.VERSION
        },
        EXTERNAL_SERVICES: {
            OPENAI_API_KEY: envVars.OPENAI_API_KEY || CONFIG.EXTERNAL_SERVICES.OPENAI_API_KEY,
            GOOGLE_CLOUD_API_KEY: envVars.GOOGLE_CLOUD_API_KEY || CONFIG.EXTERNAL_SERVICES.GOOGLE_CLOUD_API_KEY,
            ENABLE_TRANSCRIPTION: envVars.ENABLE_TRANSCRIPTION === 'true' || CONFIG.EXTERNAL_SERVICES.ENABLE_TRANSCRIPTION
        }
    };
    
    return config;
}

// Асинхронная функция для инициализации конфигурации
async function initializeConfig() {
    const envVars = await loadEnvVariables();
    return await getConfig(envVars);
}

// Проверка конфигурации
function validateConfig(config = CONFIG) {
    const errors = [];
    
    if (!config.SUPABASE.URL || config.SUPABASE.URL.includes('your-project')) {
        errors.push('SUPABASE_URL не настроен');
    }
    
    if (!config.SUPABASE.ANON_KEY || config.SUPABASE.ANON_KEY.includes('your-anon-key')) {
        errors.push('SUPABASE_ANON_KEY не настроен');
    }
    
    if (!config.DEPLOYMENT.VERCEL_URL || config.DEPLOYMENT.VERCEL_URL.includes('your-project')) {
        errors.push('VERCEL_URL не настроен');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getConfig, validateConfig, initializeConfig, loadEnvVariables };
}

// Для использования в браузере
if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
    window.getConfig = getConfig;
    window.validateConfig = validateConfig;
    window.initializeConfig = initializeConfig;
    window.loadEnvVariables = loadEnvVariables;
}
