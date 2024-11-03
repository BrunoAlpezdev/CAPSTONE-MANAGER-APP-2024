import {
	BarChart,
	CreditCard,
	Package,
	Truck,
	UserRound,
	Home
} from 'lucide-react'

const MENUPAGES = [
	{ title: 'Dashboard', icon: Home, href: '/home' },
	{ title: 'Ventas', icon: CreditCard, href: '/pos' },
	{ title: 'Inventario', icon: Package, href: '/inventario' },
	{ title: 'Proveedores', icon: Truck, href: '/proveedores' },
	{ title: 'Usuarios', icon: UserRound, href: '/usuarios' },
	{ title: 'Reportes', icon: BarChart, href: '/reportes' }
]

export { MENUPAGES }
