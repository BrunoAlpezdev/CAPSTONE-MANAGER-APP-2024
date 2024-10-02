'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ToggleMenu } from '@/components/index'
import Link from 'next/link'

export function ReportHeader() {
	// Estado para el menú
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev)
	}
	return (
		<header className='bg-Gris text-white'>
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
					<Link href='home'>
						<Image
							width={200}
							height={40}
							src='/SAVANNALOGOpng.png'
							alt='logo de negocio'
						/>
					</Link>
				</header>
			</div>

			{/* Menú plegable */}
			<ToggleMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
		</header>
	)
}
