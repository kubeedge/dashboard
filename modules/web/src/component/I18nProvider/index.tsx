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

        // 等待i18n初始化完成
        const initI18n = async () => {
            if (!i18n.isInitialized) {
                await i18n.init();
            }

            // 强制设置为英文作为初始语言，避免SSR不匹配
            if (typeof window !== 'undefined') {
                const savedLang = localStorage.getItem('i18nextLng');
                if (savedLang) {
                    await i18n.changeLanguage(savedLang);
                } else {
                    await i18n.changeLanguage('en');
                }
            } else {
                // 服务端默认英文
                await i18n.changeLanguage('en');
            }

            setIsReady(true);
        };

        initI18n();
    }, []);

    // 在客户端挂载和i18n准备就绪之前，使用默认英文
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
