'use client'

import { Footer, FullLogo, ToggleMenu } from '@/components'
import { columns } from './columns'
import { DataTable } from '@/components/inventario-table'
import { useMenu } from '@/hooks'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { SystemHeader } from '@/components/systemHeader.component'
import { MenuIcon, Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Usuario } from '@/types'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase/firebaseConfig'

async function getUsers() {
	const usuariosCol = collection(firestore, 'usuarios')
	const snapshot = await getDocs(usuariosCol)
	const data = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	})) as Usuario[]
	return data
}

export default function GestionDeUsuarios() {
	const [data, setData] = useState<Usuario[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const { isMenuOpen, toggleMenu } = useMenu()

	useEffect(() => {
		const loadUsuarios = async () => {
			try {
				const usuarios = await getUsers()
				setData(usuarios)
			} catch (error: any) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		loadUsuarios()
	}, [])
	const [isDarkMode, setIsDarkMode] = useState(() => {
		return (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		)
	})
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [isDarkMode])

	if (loading) return <p className='text-white'>Cargando usuarios...</p>
	if (error) return <p className='text-red-500'>Error: {error}</p>

	return (
		<div className='relative overflow-hidden transition-all'>
			<Toaster />
			{/* Overlay translucido (transparencia oscura del menú) */}
			{isMenuOpen && (
				<div
					className='fixed inset-0 z-40 bg-black bg-opacity-50'
					onClick={toggleMenu}
					aria-hidden='true'
				/>
			)}

			<ToggleMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

			<SystemHeader toggleMenu={toggleMenu} />

			{/* Main POS */}

			<main className='tables-fondo m-3 flex h-screen w-[calc(100dvw-40px)]'>
				<div className='w-full rounded-md border border-primary/60 bg-white/5 p-2 text-foreground backdrop-blur-sm'>
					<h1 className='text-center text-3xl font-bold'>
						Gestión De Usuarios
					</h1>
					<DataTable columns={columns} data={data} />
				</div>
			</main>

			<Footer />
		</div>
	)
}
