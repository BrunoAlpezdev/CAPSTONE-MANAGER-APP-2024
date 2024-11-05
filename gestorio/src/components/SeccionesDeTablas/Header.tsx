'use client'

import { useMenu } from '@/hooks'
import Image from 'next/image'

export function STHeader() {
	const { isMenuOpen, toggleMenu } = useMenu()
	return (
		<header className='flex h-16 items-center justify-between px-3'>
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
