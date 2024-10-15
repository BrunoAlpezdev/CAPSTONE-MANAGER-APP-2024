'use client'

import { User, columns } from './columns'
import { DataTable } from '@/components/inventario-table'
import { useMenu } from '@/hooks'
import { useState, useEffect } from 'react'

async function getUsers(): Promise<User[]> {
	const res = await fetch(
		'https://64a6f5fc096b3f0fcc80e3fa.mockapi.io/api/users'
	)
	const data = await res.json()

	// Validación de datos
	if (!Array.isArray(data)) {
		throw new Error('Los datos no son un array')
	}

	return data
}

export default function GestionDeUsuarios() {
	const [data, setData] = useState<User[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const { isMenuOpen, toggleMenu } = useMenu()

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
			{isMenuOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40'
					onClick={toggleMenu}
					aria-hidden='true'
				/>
			)}

			<div className='mx-auto bg-white'>
				<h1 className='text-3xl font-bold text-black text-center'>
					Gestión De Usuarios
				</h1>
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	)
}
