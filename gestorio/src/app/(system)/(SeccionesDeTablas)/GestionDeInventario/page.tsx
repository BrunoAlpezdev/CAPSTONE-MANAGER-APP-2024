'use client'

import React from 'react'
import { ToggleMenu, Footer, Sidebar } from '@/components/index'
import { useMenu } from '@/hooks/useMenu'
import Image from 'next/image'
import '@/styles/usuarios.css'

const data = [
	{
		id: 1,
		nombre: 'Producto 1',
		detallesContacto: 'contacto1@example.com',
		ordenCompra: 'OC-001',
		rut: '12345678-9',
		comprasTotales: 1000,
		estadoCuenta: 'Activo'
	},
	{
		id: 2,
		nombre: 'Producto 2',
		detallesContacto: 'contacto2@example.com',
		ordenCompra: 'OC-002',
		rut: '98765432-1',
		comprasTotales: 2000,
		estadoCuenta: 'Inactivo'
	},
	{
		id: 3,
		nombre: 'Producto 3',
		detallesContacto: 'contacto3@example.com',
		ordenCompra: 'OC-003',
		rut: '11223344-5',
		comprasTotales: 3000,
		estadoCuenta: 'Activo'
	},
	{
		id: 3,
		nombre: 'Producto 3',
		detallesContacto: 'contacto3@example.com',
		ordenCompra: 'OC-003',
		rut: '11223344-5',
		comprasTotales: 3000,
		estadoCuenta: 'Activo'
	},
	{
		id: 3,
		nombre: 'Producto 3',
		detallesContacto: 'contacto3@example.com',
		ordenCompra: 'OC-003',
		rut: '11223344-5',
		comprasTotales: 3000,
		estadoCuenta: 'Activo'
	},
	{
		id: 3,
		nombre: 'Producto 3',
		detallesContacto: 'contacto3@example.com',
		ordenCompra: 'OC-003',
		rut: '11223344-5',
		comprasTotales: 3000,
		estadoCuenta: 'Activo'
	},
	{
		id: 3,
		nombre: 'Producto 3',
		detallesContacto: 'contacto3@example.com',
		ordenCompra: 'OC-003',
		rut: '11223344-5',
		comprasTotales: 3000,
		estadoCuenta: 'Activo'
	},
	{
		id: 3,
		nombre: 'Producto 3',
		detallesContacto: 'contacto3@example.com',
		ordenCompra: 'OC-003',
		rut: '11223344-5',
		comprasTotales: 3000,
		estadoCuenta: 'Activo'
	},
	{
		id: 3,
		nombre: 'Producto 3',
		detallesContacto: 'contacto3@example.com',
		ordenCompra: 'OC-003',
		rut: '11223344-5',
		comprasTotales: 3000,
		estadoCuenta: 'Activo'
	},
	{
		id: 3,
		nombre: 'Producto 3',
		detallesContacto: 'contacto3@example.com',
		ordenCompra: 'OC-003',
		rut: '11223344-5',
		comprasTotales: 3000,
		estadoCuenta: 'Activo'
	}
]

export default function GestionDeUsuarios() {
	const { isMenuOpen, toggleMenu } = useMenu()

	return (
		<div className='relative transition-all'>
			{isMenuOpen && (
				<div
					className='fixed inset-0 bg-white bg-opacity-50 z-40'
					onClick={toggleMenu}
					aria-hidden='true'
				/>
			)}

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
			{}
			<ToggleMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

			<div className='p-10 bg-white'>
				<h2 className='text-2xl font-semibold mb-4 text-black'>
					Gestión de Usuarios
				</h2>
				<table className='min-w-full border-10 gap-10 shadow-2x1 border-GrisClaro border-2'>
					<thead className='text-center text-black'>
						<tr className='bg-GrisClaro cursor-pointer duration-300 border-2'>
							<th></th>
							<th>ID</th>
							<th>Nombre</th>
							<th>Detalles de Contacto</th>
							<th>Orden de Compra</th>
							<th>RUT</th>
							<th>Compras Totales</th>
							<th>Estado de Cuenta</th>
							<th>Acción</th>
						</tr>
					</thead>
					<tbody className='text-center text-black'>
						{data.map((item, index) => {
							const rowClass =
								index % 3 === 0
									? 'bg-slate-50 hover:bg-slate-200'
									: index % 3 === 1
										? 'bg-slate-100 hover:bg-slate-300'
										: 'bg-slate-200 hover:bg-slate-400'
							return (
								<tr key={item.id} className={`${rowClass}`}>
									<td>
										<input type='checkbox' />
									</td>
									<td className='py-3 px-6 hover:scale-100'>{item.id}</td>
									<td className='py-3 px-6 hover:scale-100'>{item.nombre}</td>
									<td className='py-3 px-6 hover:scale-100'>
										{item.detallesContacto}
									</td>
									<td className='py-3 px-6 hover:scale-105'>
										{item.ordenCompra}
									</td>
									<td className='py-3 px-6 hover:scale-100'>{item.rut}</td>
									<td className='py-3 px-6 hover:scale-100'>
										{item.comprasTotales}
									</td>
									<td className='py-3 px-6 hover:scale-100'>
										{item.estadoCuenta}
									</td>
									<td className='rounded-full decoration-slate-900'>
										<button className='action-bottom hover:scale-105'>
											accion<span></span>
										</button>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}
