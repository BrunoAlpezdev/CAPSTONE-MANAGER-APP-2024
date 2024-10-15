'use client'
import Link from 'next/link'
import { AnimateContent } from '@/components'
import { createElement } from 'react'
import { MENUPAGES } from '@/data/consts'

export function Menu() {
	return (
		<div className='w-fit h-full bg-background/90 text-foreground px-6 py-12 font-normal z-auto main-fondo'>
			<section className='flex flex-col gap-12'>
				{MENUPAGES.map(({ title, icon, href }) => (
					<AnimateContent key={title}>
						<Link href={href} className='flex flex-row gap-2 items-center w-48'>
							{createElement(icon)}
							<p>{title}</p>
						</Link>
					</AnimateContent>
				))}
			</section>
		</div>
	)
}
