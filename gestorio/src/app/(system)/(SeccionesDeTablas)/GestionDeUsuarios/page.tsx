'use client'

import { User, columns } from './columns'
import { DataTable } from '@/components/data-table'
import { ToggleMenu } from '@/components/index'
import { useMenu } from '@/hooks/useMenu'
import Image from 'next/image'
import { useState, useEffect } from 'react'

async function getUsers(): Promise<User[]> {
	const res = await fetch(
		'https://64a6f5fc096b3f0fcc80e3fa.mockapi.io/api/users'
	)
	const data = await res.json()
	return data
}

export default function GestionDeUsuarios() {
	// Estado para los datos de usuarios
	const [data, setData] = useState<User[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Estado del menú
	const { isMenuOpen, toggleMenu } = useMenu()

	// Cargar los usuarios al montar el componente
	useEffect(() => {
		const loadUsers = async () => {
			try {
				const users = await getUsers()
				setData(users)
			} catch (error: any) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		loadUsers()
	}, [])

	if (loading) return <p className='text-white'>Cargando usuarios...</p>
	if (error) return <p className='text-red-500'>Error: {error}</p>

	return (
		<div className='relative transition-all'>
			{/* Overlay translucido (transparencia oscura del menú) */}
			{isMenuOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40'
					onClick={toggleMenu}
					aria-hidden='true'
				/>
			)}

			<div className='flex flex-col text-white'>
				{/* Header con el botón de menú */}
				<header className='flex justify-between items-center h-16 px-3'>
					<button onClick={toggleMenu}>
						<Image src='menu.svg' alt='alt' width={30} height={30} />
					</button>
					<Image
						width={200}
						height={40}
						src='/SAVANNALOGOpng.png'
						alt='logo de negocio'
					/>
				</header>
			</div>

			{/* Menú plegable */}
			<ToggleMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

			{/* Sección de la gestión de usuarios */}
			<div className='mx-auto bg-white'>
				<h1 className='text-3xl font-bold text-black text-center'>
					Gestión De Usuarios
				</h1>
				<DataTable columns={columns} data={data || []} />
			</div>
		</div>
	)
}
