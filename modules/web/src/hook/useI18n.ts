import { useTranslation } from 'react-i18next';

export function useI18n() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    const getCurrentLanguage = () => {
        return i18n.language;
    };

    const isChineseLanguage = () => {
        return i18n.language.startsWith('zh');
    };

    return {
        t,
        i18n,
        changeLanguage,
        getCurrentLanguage,
        isChineseLanguage,
    };
}
