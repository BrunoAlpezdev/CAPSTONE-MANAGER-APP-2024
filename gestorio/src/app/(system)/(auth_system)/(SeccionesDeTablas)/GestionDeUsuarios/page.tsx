'use client'
import { User, columns } from './columns'
import { DataTable } from '@/components/data-table'
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
