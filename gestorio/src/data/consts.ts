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
	{ title: 'Ventas', icon: CreditCard, href: '/SistemaDeVentas' },
	{ title: 'Inventario', icon: Package, href: '/Inventario' },
	{ title: 'Proveedores', icon: Truck, href: '/GestionDeProveedores' },
	{ title: 'Usuarios', icon: UserRound, href: '/GestionDeUsuarios' },
	{ title: 'Reportes', icon: BarChart, href: '/Reportes' }
]

export { MENUPAGES }
