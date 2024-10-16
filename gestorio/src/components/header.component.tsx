'use client'

import Image from 'next/image'
import { AnimateContent } from '@/components'
import { FullLogo } from './FullLogo.component'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/firebase'
export function Header() {
	return (
		<header
			className={`flex justify-between items-center bg-background text-foreground h-16 px-6 `}>
			<FullLogo size='large' />
			<AnimateContent>
				<section className='flex flex-row gap-6 bg-accent/90 text-accent-foreground rounded-full py-2 px-3 pr-5 cursor-pointer'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className='flex flex-row gap-2 justify-center items-center border-none outline-none'>
								<Image
									src={'/User.jpeg'}
									alt='Logo de Negocio'
									width={30}
									height={30}
									className='cursor-pointer rounded-full aspect-square pointer-events-none'
								/>
								<p>Negocio</p>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-fit'>
							<DropdownMenuLabel>Negocio</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									signOut()
								}}>
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</section>
			</AnimateContent>
		</header>
	)
}
