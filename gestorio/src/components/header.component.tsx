'use client'

import Image from 'next/image'
import { ThemeSwitch } from '@/components'
import { FullLogo } from './FullLogo.component'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/firebase'
import setupDatabase from '@/lib/db/RxDB'
import { useEffect, useState } from 'react'
import { RxDatabase } from 'rxdb'
import { Bell, BellRing, BellRingIcon, Moon, Sun } from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'
import { Notificacion } from '@/types'
import { Switch } from './ui/switch'

export function Header() {
	// Estado para manejar la bd
	const [db, setDb] = useState<RxDatabase | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isNotificationOpen, setIsNotificationOpen] = useState(false)

	const [notificaciones, setNotificacion] = useState<Notificacion[]>(() => {
		// Cargar los tickets desde localStorage al iniciar la aplicación
		const savedNotificacion = localStorage.getItem('notificaciones')
		return savedNotificacion ? JSON.parse(savedNotificacion) : []
	})

	const handlerEliminarNotificacion = (id: string) => {
		const notificacionFiltrada = notificaciones.filter(
			(notificacion) => notificacion.id !== id
		)
		setNotificacion(notificacionFiltrada)
		localStorage.setItem('notificaciones', JSON.stringify(notificacionFiltrada))
	}

	const isNotificacionesEmpty = notificaciones.length === 0

	async function initDatabase() {
		try {
			const database = await setupDatabase() // Invoca la función de setup
			if (database) {
				setDb(database) // Almacena la referencia de la base de datos en el estado
			} else {
				setError('Failed to setup database')
			}
		} catch (err) {
			console.error('Error setting up the database:', err)
			setError('Failed to setup database')
		}
	}

	return (
		<header
			className={`flex h-fit items-center justify-between bg-background px-6 py-2 text-foreground`}>
			<FullLogo size='large' />
			<section className='flex cursor-pointer flex-row gap-6 text-accent-foreground'>
				<ThemeSwitch />
				<div className='relative'>
					{isNotificacionesEmpty ? (
						<button
							className='relative flex h-full items-center justify-center'
							onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
							<Bell className='text-foreground' />
						</button>
					) : (
						<button
							className='relative flex h-full animate-wiggle items-center justify-center'
							onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
							<BellRing className='text-yellow-500' />
							{/* Indicador de notificación */}
							<span className='absolute -right-1 -top-1 block h-fit w-fit rounded-full bg-red-500 ring-1 ring-white'>
								<p className='px-1 text-xs'>
									{notificaciones.length > 9 ? '9+' : notificaciones.length}
								</p>
							</span>
							<span className='absolute -right-1 -top-1 block h-fit w-fit rounded-full bg-red-500 ring-1 ring-white'>
								<p className='px-1 text-xs'>
									{notificaciones.length > 9 ? '9+' : notificaciones.length}
								</p>
							</span>
						</button>
					)}

					<div
						className={`absolute right-0 z-10 mt-2 w-96 rounded-lg border border-primary/60 bg-secondary/5 p-6 shadow-lg backdrop-blur-lg transition-all duration-200 ${
							isNotificationOpen
								? 'visible -translate-y-2 opacity-100'
								: 'invisible -translate-y-6 opacity-0'
						}`}>
						<p className='mb-2 text-lg font-semibold text-foreground'>
							Notificaciones
						</p>
						<div>
							{notificaciones.length === 0 ? (
								<p className='text-sm text-foreground'>
									No tienes nuevas notificaciones.
								</p>
							) : (
								<ul>
									{notificaciones.map((notificacion, index) => (
										<li
											key={index}
											className={`flex items-start space-x-2 py-3 ${
												index < notificaciones.length - 1
													? 'border-b border-gray-300'
													: ''
											}`}>
											{/* Icono de notificación */}
											<section className='mt-1'>
												<Bell className='text-yellow-500' />
											</section>
											{/* Mensaje de notificación */}
											<section>
												<p className='text-sm text-foreground'>
													{notificacion.mensaje}
												</p>
											</section>
											<button
												className='ml-auto text-red-500'
												onClick={() =>
													handlerEliminarNotificacion(notificacion.id)
												}>
												Eliminar
											</button>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className='flex flex-row items-center justify-center gap-2 rounded-full border-border bg-secondary px-3 py-1 pr-4 outline-none transition-all hover:scale-95'>
							<Image
								src={'/User.jpeg'}
								alt='Logo de Negocio'
								width={30}
								height={30}
								className='pointer-events-none aspect-square cursor-pointer select-none rounded-full'
							/>
							<p className='select-none text-foreground'>Negocio</p>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-fit'>
						<DropdownMenuLabel>Negocio</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								signOut()
								localStorage.removeItem('userUuid')
								localStorage.removeItem('notificaciones')
								localStorage.removeItem('tickets')
							}}>
							Log out
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								await initDatabase()
							}}>
							Initialize Database
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</section>
		</header>
	)
}
