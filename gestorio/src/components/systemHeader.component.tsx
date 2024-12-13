import { BellOff, MenuIcon, Moon, Sun, Trash2 } from 'lucide-react'
import { FullLogo } from './FullLogo.component'
import { useEffect, useState } from 'react'
import { Switch } from './ui/switch'
import { ThemeSwitch } from './ThemeSwitch'
import toast from 'react-hot-toast'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'

type ToggleMenuProps = {
	toggleMenu: () => void
}

export const SystemHeader = ({ toggleMenu }: ToggleMenuProps) => {
	return (
		<header className='flex h-16 items-center justify-between px-3'>
			<button onClick={toggleMenu}>
				<MenuIcon className='fill-foreground' />
			</button>
			<div className='flex items-center space-x-4'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<button
								className='flex h-full w-full justify-center'
								onClick={() => toast.remove()}>
								<Trash2 />
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Descartar notificaciones</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<ThemeSwitch />
				<FullLogo size='large' />
			</div>
		</header>
	)
}
