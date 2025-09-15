'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locale';

interface I18nProviderProps {
    children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
    const [isReady, setIsReady] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Wait for i18n initialization to complete
        const initI18n = async () => {
            if (!i18n.isInitialized) {
                await i18n.init();
            }

            // Force set to English as initial language to avoid SSR mismatch
            if (typeof window !== 'undefined') {
                const savedLang = localStorage.getItem('i18nextLng');
                if (savedLang) {
                    await i18n.changeLanguage(savedLang);
                } else {
                    await i18n.changeLanguage('en');
                }
            } else {
                // Server-side default to English
                await i18n.changeLanguage('en');
            }

            setIsReady(true);
        };

        initI18n();
    }, []);

    // Before client mount and i18n ready, use default English
    if (!isMounted || !isReady) {
        return (
            <I18nextProvider i18n={i18n}>
                {children}
            </I18nextProvider>
        );
    }

    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
}
