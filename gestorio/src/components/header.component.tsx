'use client'

import Image from 'next/image'
import { AnimateContent } from '@/components'
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
import { BellRingIcon } from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'
import { Notificacion } from '@/types'

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
				<div className='relative'>
					<button onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
						<BellRingIcon />
					</button>

					{isNotificationOpen && (
						<div className='absolute right-0 z-10 mt-2 w-64 rounded-lg bg-secondary p-6 shadow-lg'>
							<p className='mb-2 text-lg font-semibold text-accent-foreground'>
								Notificaciones
							</p>
							<div>
								{notificaciones.length === 0 ? (
									<p className='text-sm text-accent-foreground'>
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
												<div className='mt-1'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='h-6 w-6 text-yellow-500'
														viewBox='0 0 20 20'
														fill='currentColor'>
														<path
															fillRule='evenodd'
															d='M10 2a6 6 0 00-6 6v3.586l-1.707 1.707a1 1 0 001.414 1.414L5 13.414V16a2 2 0 002 2h6a2 2 0 002-2v-2.586l.293.293a1 1 0 001.414-1.414L16 11.586V8a6 6 0 00-6-6zM8 18a1 1 0 002 0h-2z'
															clipRule='evenodd'
														/>
													</svg>
												</div>
												{/* Mensaje de notificación */}
												<div>
													<p className='text-sm text-accent-foreground'>
														{notificacion.mensaje}
													</p>
												</div>
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
					)}
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
