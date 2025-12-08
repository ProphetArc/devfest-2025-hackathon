export type Language = 'ru' | 'en';

type UITranslations = {
    appSubtitle: string;
    footerText: string;
    discoverTitle: string;
    discoverSubtitle: string;
    searchInputPlaceholder: string;
    searchButtonLabel: string;
    suggestionsLabel: string;
    suggestions: string[];
    noResults: string;
    backToResults: string;
    galleryTitle: string;
    aiTitle: string;
    aiPlaceholder: string;
    aiSend: string;
    aiAskAbout: string;
    aiInitialMessage: string;
    aiErrorTitle: string;
    aiErrorDescription: string;
    searchActionError: string;
    expandActionError: string;
};

type AllTranslations = {
    [key in Language]: UITranslations;
};

export const uiTexts: AllTranslations = {
    ru: {
        appSubtitle: 'Культурный гид по Павлодару',
        footerText: '© {year} Vector. Создано с любовью к Павлодару.',
        discoverTitle: 'Откройте для себя Павлодар',
        discoverSubtitle: 'Улицы, личности, история и культура.',
        searchInputPlaceholder: "Например, 'Улица Сатпаева' или 'Павел Васильев'...",
        searchButtonLabel: 'Поиск',
        suggestionsLabel: 'Или попробуйте:',
        suggestions: ['Павел Васильев', 'Улица Сатпаева', 'Экибастуз'],
        noResults: 'Ничего не найдено. Попробуйте другой запрос.',
        backToResults: 'Назад к результатам',
        galleryTitle: 'Галерея',
        aiTitle: 'Узнать больше с ИИ',
        aiPlaceholder: 'Спросите что-нибудь про "{itemName}"...',
        aiSend: 'Отправить',
        aiAskAbout: 'Задайте вопрос об этом объекте.',
        aiInitialMessage: "Пожалуйста, задайте вопрос.",
        aiErrorTitle: "Ошибка ИИ",
        aiErrorDescription: "Не удалось получить ответ. Пожалуйста, попробуйте еще раз.",
        searchActionError: "Произошла ошибка при поиске.",
        expandActionError: "Извините, произошла ошибка при обращении к ИИ. Попробуйте позже.",
    },
    en: {
        appSubtitle: 'Cultural guide to Pavlodar',
        footerText: '© {year} Vector. Created with love for Pavlodar.',
        discoverTitle: 'Discover Pavlodar',
        discoverSubtitle: 'Streets, figures, history, and culture.',
        searchInputPlaceholder: "e.g., 'Satpayev Street' or 'Pavel Vasilyev'...",
        searchButtonLabel: 'Search',
        suggestionsLabel: 'Or try:',
        suggestions: ['Pavel Vasilyev', 'Satpayev Street', 'Ekibastuz'],
        noResults: 'Nothing found. Try a different query.',
        backToResults: 'Back to results',
        galleryTitle: 'Gallery',
        aiTitle: 'Learn more with AI',
        aiPlaceholder: 'Ask something about "{itemName}"...',
        aiSend: 'Send',
        aiAskAbout: 'Ask a question about this item.',
        aiInitialMessage: "Please ask a question.",
        aiErrorTitle: "AI Error",
        aiErrorDescription: "Failed to get a response. Please try again.",
        searchActionError: "An error occurred during search.",
        expandActionError: "Sorry, there was an error contacting the AI. Please try again later.",
    }
};

