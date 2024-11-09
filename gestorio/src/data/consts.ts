import {
	HOME_ROUTE,
	INVENTARIO_ROUTE,
	POS_ROUTE,
	PROVEEDORES_ROUTE,
	REPORTES_ROUTE,
	USUARIOS_ROUTE
} from '@/lib/routes'
import {
	BarChart,
	CreditCard,
	Package,
	Truck,
	UserRound,
	Home
} from 'lucide-react'

const MENUPAGES = [
	{ title: 'Dashboard', icon: Home, href: HOME_ROUTE },
	{ title: 'Ventas', icon: CreditCard, href: POS_ROUTE },
	{ title: 'Inventario', icon: Package, href: INVENTARIO_ROUTE },
	{ title: 'Proveedores', icon: Truck, href: PROVEEDORES_ROUTE },
	{ title: 'Usuarios', icon: UserRound, href: USUARIOS_ROUTE },
	{ title: 'Reportes', icon: BarChart, href: REPORTES_ROUTE }
]

export { MENUPAGES }
