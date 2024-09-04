'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
	const [isPressed, setIsPressed] = useState(false)
	const [isHovered, setIsHovered] = useState(false)

	return (
		<header
			className={`flex justify-between items-center bg-Gris text-Blanco h-24 px-6 `}>
			<section>
				<Link href='/home'>
					<Image
						src='/SAVANNALOGOpng.png'
						alt='Logo de Savanna'
						width={200}
						height={40}
						className='cursor-pointer aspect-video w-auto h-auto'
					/>
				</Link>
			</section>
			<section
				className={`flex flex-row gap-6 bg-Naranjo/90 rounded-full py-2 px-3 pr-5 cursor-pointer transition-all ${isHovered ? 'scale-105' : 'scale-100'} ${isPressed ? 'scale-95' : 'scale-100'}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseDown={() => {
					setIsHovered(false)
					setIsPressed(true)
				}}
				onMouseUp={() => {
					setIsHovered(false)
					setIsPressed(false)
				}}
				onMouseLeave={() => {
					setIsHovered(false)
					setIsPressed(false)
				}}>
				<button className='flex flex-row gap-2 justify-center items-center'>
					<Image
						src={'/User.jpeg'}
						alt='Logo de Savanna'
						width={30}
						height={30}
						className='cursor-pointer rounded-full aspect-square'
					/>
					<p>Usuario</p>
				</button>
			</section>
		</header>
	)
}
