import Image from 'next/image'
import Link from 'next/link'

interface props {
	size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'header' | 'auth'
	editClass?: string
}

function CalculateSize(size: string) {
	const lowerSize = size.toLowerCase()

	let CUBE_WIDTH = 20
	let CUBE_HEIGHT = 10

	let GAP = 2

	let LOGO_WIDTH = 124
	let LOGO_HEIGHT = 62

	switch (lowerSize) {
		case 'tiny':
			CUBE_WIDTH = 5
			CUBE_HEIGHT = 5
			LOGO_WIDTH = 31
			LOGO_HEIGHT = 15
			GAP = 1
			return { CUBE_WIDTH, CUBE_HEIGHT, LOGO_WIDTH, LOGO_HEIGHT, GAP }
		case 'small':
			CUBE_WIDTH = 10
			CUBE_HEIGHT = 5
			LOGO_WIDTH = 62
			LOGO_HEIGHT = 30
			GAP = 2
			return { CUBE_WIDTH, CUBE_HEIGHT, LOGO_WIDTH, LOGO_HEIGHT, GAP }
		case 'medium':
			return { CUBE_WIDTH, CUBE_HEIGHT, LOGO_WIDTH, LOGO_HEIGHT, GAP }
		case 'large':
			CUBE_WIDTH = 40
			CUBE_HEIGHT = 20
			LOGO_WIDTH = 248
			LOGO_HEIGHT = 124
			GAP = 3
			return { CUBE_WIDTH, CUBE_HEIGHT, LOGO_WIDTH, LOGO_HEIGHT, GAP }
		case 'huge':
			CUBE_WIDTH = 80
			CUBE_HEIGHT = 40
			LOGO_WIDTH = 496
			LOGO_HEIGHT = 248
			GAP = 6
			return { CUBE_WIDTH, CUBE_HEIGHT, LOGO_WIDTH, LOGO_HEIGHT, GAP }
		case 'header':
			CUBE_WIDTH = 40
			CUBE_HEIGHT = 100
			LOGO_WIDTH = 250
			LOGO_HEIGHT = 100
			GAP = 3
			return { CUBE_WIDTH, CUBE_HEIGHT, LOGO_WIDTH, LOGO_HEIGHT, GAP }
		case 'auth':
			CUBE_WIDTH = 80
			CUBE_HEIGHT = 100
			LOGO_WIDTH = 500
			LOGO_HEIGHT = 100
			GAP = 6
			return { CUBE_WIDTH, CUBE_HEIGHT, LOGO_WIDTH, LOGO_HEIGHT, GAP }
		default:
			return { CUBE_WIDTH, CUBE_HEIGHT, LOGO_WIDTH, LOGO_HEIGHT, GAP }
	}
}

export function FullLogo({ size, editClass }: props) {
	const calculatedSize = CalculateSize(size)

	if (typeof calculatedSize === 'string') {
		return (
			<section className={editClass}>
				<Link href='/home' className='flex h-fit w-fit flex-row gap-6'>
					<Image
						priority
						src='/MINI-GESTORIO-ICON-CUBE.svg'
						alt='Gestorio CL Mini Logo'
						width={40}
						height={40}
						style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
						className='pointer-events-none select-none bg-background'
					/>
					<Image
						priority
						src='/GESTORIO-LOGO.svg'
						alt='Gestorio CL Logo'
						width={40}
						height={40}
						style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
						className='pointer-events-none select-none bg-background'
					/>
				</Link>
			</section>
		)
	} else {
		return (
			<section className={editClass}>
				<div className={`flex h-fit w-fit flex-row gap-${calculatedSize.GAP}`}>
					<Image
						priority
						src='/MINI-GESTORIO-ICON-CUBE.svg'
						alt='Gestorio CL Mini Logo'
						width={calculatedSize.CUBE_WIDTH}
						height={calculatedSize.CUBE_HEIGHT}
						className='pointer-events-none select-none bg-background'
					/>
					<Image
						priority
						src='/GESTORIO-LOGO.svg'
						alt='Gestorio CL Logo'
						width={calculatedSize.LOGO_WIDTH}
						height={calculatedSize.LOGO_HEIGHT}
						style={{ objectFit: 'contain' }}
						className='pointer-events-none select-none bg-background'
					/>
				</div>
			</section>
		)
	}
}
