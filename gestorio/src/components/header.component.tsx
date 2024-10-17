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
			className={`flex justify-between items-center bg-background text-foreground py-2 h-fit px-6 `}>
			<FullLogo size='large' />
			<section className='flex flex-row gap-6 text-accent-foreground cursor-pointer'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className='border-none outline-none'>
							<AnimateContent>
								<button className='flex flex-row gap-2 justify-center items-center border-border bg-secondary outline-none  rounded-full py-1 px-3 pr-4'>
									<Image
										src={'/User.jpeg'}
										alt='Logo de Negocio'
										width={30}
										height={30}
										className='cursor-pointer rounded-full aspect-square pointer-events-none'
									/>
									<p>Negocio</p>
								</button>
							</AnimateContent>
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
		</header>
	)
}
