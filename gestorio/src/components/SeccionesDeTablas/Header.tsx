'use client'

import { ToggleMenu, Footer, Sidebar } from '@/components/index'
import { useMenu } from '@/hooks/useMenu'
import Image from 'next/image'

export function STHeader() {
	const { isMenuOpen, toggleMenu } = useMenu()
	return (
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
	)
}
