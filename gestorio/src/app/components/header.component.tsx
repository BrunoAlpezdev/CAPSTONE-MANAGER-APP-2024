import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
	return (
		<header className='flex justify-between items-center bg-Gris text-Blanco p-6 '>
			<section className='flex flex-row gap-6'>
				<Image
					src={'/SAVANNALOGOpng.png'}
					alt='Logo de Savanna'
					width={200}
					height={100}
				/>
				<button className='flex flex-row gap-2 justify-center items-center'>
					<Image
						src={'/user.svg'}
						alt='Logo de Savanna'
						width={30}
						height={100}
						className='cursor-pointer'
					/>
					<p>Usuario</p>
				</button>
			</section>

			<section className='flex flex-row gap-4 justify-center items-center'>
				<Link
					href=''
					className='flex flex-row gap-2 justify-center items-center'>
					<Image
						src={'/POS.svg'}
						alt='Logo de Savanna'
						width={30}
						height={100}
						className='cursor-pointer'
					/>
					<p>Sistema de Ventas</p>
				</Link>
				<Link
					href=''
					className='flex flex-row gap-2 justify-center items-center'>
					<Image
						src={'/inventario.svg'}
						alt='Logo de Savanna'
						width={30}
						height={100}
						className='cursor-pointer'
					/>
					<p>Inventario</p>
				</Link>
				<Link
					href=''
					className='flex flex-row gap-2 justify-center items-center'>
					<Image
						src={'/proveedores.svg'}
						alt='Logo de Savanna'
						width={30}
						height={100}
						className='cursor-pointer'
					/>
					<p>Proveedores</p>
				</Link>
				<Link
					href=''
					className='flex flex-row gap-2 justify-center items-center'>
					<Image
						src={'/reportes.svg'}
						alt='Logo de Savanna'
						width={30}
						height={100}
						className='cursor-pointer'
					/>
					<p>Reportes</p>
				</Link>
				{/* <button>
					<Image
						src={'/menu.svg'}
						alt='Logo de Savanna'
						width={30}
						height={100}
						className='cursor-pointer'
					/>
				</button> */}
			</section>
		</header>
	)
}
