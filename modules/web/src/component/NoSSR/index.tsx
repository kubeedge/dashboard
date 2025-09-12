'use client';

import { useEffect, useState } from 'react';

interface NoSSRProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * NoSSR组件 - 防止服务端渲染和客户端渲染不匹配
 * 在客户端完成水合之前显示fallback内容
 */
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
