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

export function Header() {
	// Estado para manejar la bd
	const [db, setDb] = useState<RxDatabase | null>(null)
	const [error, setError] = useState<string | null>(null)

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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className='flex flex-row items-center justify-center gap-2 rounded-full border-border bg-secondary px-3 py-1 pr-4 outline-none transition-all hover:scale-95'>
							<Image
								src={'/User.jpeg'}
								alt='Logo de Negocio'
								width={30}
								height={30}
								className='pointer-events-none aspect-square cursor-pointer rounded-full'
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
