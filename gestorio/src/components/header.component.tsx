'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimateContent } from '@components/index'

export function Header() {
	return (
		<header
			className={`flex justify-between items-center bg-Gris text-Blanco h-24 px-6 shadow-bottom `}>
			<section>
				<Link href='/home' className='w-fit h-fit'>
					<Image
						src='/SAVANNALOGOpng.png'
						alt='Logo de Savanna'
						id='logo'
						width={300}
						height={47}
						className='cursor-pointer max-w-full max-h-full pointer-events-none'
					/>
				</Link>
			</section>
			<AnimateContent>
				<section className='flex flex-row gap-6 bg-Naranjo/90 rounded-full py-2 px-3 pr-5 cursor-pointer'>
					<button className='flex flex-row gap-2 justify-center items-center'>
						<Image
							src={'/User.jpeg'}
							alt='Logo de User'
							width={30}
							height={30}
							className='cursor-pointer rounded-full aspect-square pointer-events-none'
						/>
						<p>Usuario</p>
					</button>
				</section>
			</AnimateContent>
		</header>
	)
}
