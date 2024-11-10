'use client'
import Link from 'next/link'
import { AnimateContent } from '@/components'
import { createElement } from 'react'
import { MENUPAGES } from '@/data/consts'

export function Menu() {
	return (
		<div className='main-fondo z-auto h-full w-fit bg-background/90 px-6 py-12 font-normal text-foreground'>
			<section className='flex select-none flex-col gap-12'>
				{MENUPAGES.map(({ title, icon, href }) => (
					<AnimateContent key={title}>
						<Link href={href} className='flex w-48 flex-row items-center gap-2'>
							{createElement(icon)}
							<p>{title}</p>
						</Link>
					</AnimateContent>
				))}
			</section>
		</div>
	)
}
