'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locale';

interface I18nProviderProps {
    children: React.ReactNode;
    initialLanguage?: string;
}

export default function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
    const [isReady, setIsReady] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Wait for i18n initialization to complete
        const initI18n = async () => {
            if (!i18n.isInitialized) {
                await i18n.init();
            }

            // Prefer initialLanguage (from SSR header), fallback to saved or 'en'
            let lang = initialLanguage;
            if (!lang && typeof window !== 'undefined') {
                lang = localStorage.getItem('i18nextLng') || undefined;
            }
            await i18n.changeLanguage(lang || 'en');

            setIsReady(true);
        };

        initI18n();
    }, [initialLanguage]);

    // Avoid rendering children until i18n is ready to prevent hydration mismatch
    if (!isMounted || !isReady) {
        return null;
    }

    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
}
