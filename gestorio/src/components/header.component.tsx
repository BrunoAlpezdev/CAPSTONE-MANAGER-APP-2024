'use client'

import Image from 'next/image'
import { AnimateContent } from '@/components'
import { FullLogo } from './FullLogo.component'

export function Header() {
	return (
		<header
			className={`flex justify-between items-center bg-background text-foreground h-16 px-6 `}>
			<FullLogo size='large' />
			<AnimateContent>
				<section className='flex flex-row gap-6 bg-accent/90 text-accent-foreground rounded-full py-2 px-3 pr-5 cursor-pointer'>
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
