'use client'

import { Footer, ToggleMenu } from '@/components'
import { columns } from './columns'
import { DataTable } from '@/components/historial-table'
import { useMenu } from '@/hooks'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { SystemHeader } from '@/components/systemHeader.component'
import { Historial } from '@/types'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase/firebaseConfig'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Progress } from '@/components/ui/progress'

async function getUsers() {
	const historialesCol = collection(firestore, 'historiales')
	const snapshot = await getDocs(historialesCol)
	const data = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	})) as Historial[]
	return data
}

export default function GestionDeHistoriales() {
	const [data, setData] = useState<Historial[]>([])
	const [loading, setLoading] = useState(true)
	const [progress, setProgress] = useState(0)
	const [error, setError] = useState<string | null>(null)

	const { isMenuOpen, toggleMenu } = useMenu()

	useEffect(() => {
		const loadHistoriales = async () => {
			try {
				const interval = setInterval(() => {
					setProgress((prev) => (prev < 95 ? prev + 5 : prev))
				}, 200)

				const historiales = await getUsers()

				clearInterval(interval)
				setData(historiales)
				setProgress(100)
			} catch (error: any) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		loadHistoriales()
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

	if (loading) {
		return (
			<div className='flex flex-col items-center text-foreground'>
				<p className='mb-2'>Cargando Historial...</p>
				<Progress
					value={progress}
					className='h-2 w-3/4 rounded bg-gray-200 dark:bg-gray-800'
				/>
			</div>
		)
	}
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
			<main className='tables-fondo m-3 flex h-[calc(100dvh-108px)] w-[calc(100dvw-40px)]'>
				<ScrollArea className='scrollbar-modifier flex h-full w-full rounded-md border border-primary/60 bg-white/5 p-2 text-foreground backdrop-blur-sm'>
					<h1 className='text-center text-3xl font-bold'>
						Historial de Ventas
					</h1>
					<DataTable columns={columns} data={data} />
				</ScrollArea>
			</main>
			<Footer />
		</div>
	)
}
