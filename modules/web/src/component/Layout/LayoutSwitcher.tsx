'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import DashboardLayout from '@/component/Layout/DashboardLayout'

type LayoutSwitcherProps = {
	children: ReactNode
}

export default function LayoutSwitcher({ children }: LayoutSwitcherProps) {
	const pathname = usePathname()
	const isLoginRoute = pathname === '/login'

	if (isLoginRoute) {
		return <>{children}</>
	}

	return (
		<DashboardLayout>
			{children}
		</DashboardLayout>
	)
}
