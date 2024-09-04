import Image from 'next/image'
import Link from 'next/link'
export default function Menu() {
	return (
		<div className='w-fit h-full bg-Gris/90 text-Blanco px-6 py-4 font-normal'>
			<section className='flex flex-col gap-12'>
				<Link href='/' className='flex flex-row gap-2 items-center w-48'>
					<Image
						src={'/POS.svg'}
						alt='Logo de Savanna'
						width={30}
						height={30}
						className='cursor-pointer'
					/>
					<p>Sistema de Ventas</p>
				</Link>
				<Link href='/' className='flex flex-row gap-2 items-center'>
					<Image
						src={'/inventario.svg'}
						alt='Logo de Savanna'
						width={30}
						height={100}
						className='cursor-pointer'
					/>
					<p>Inventario</p>
				</Link>
				<Link href='/' className='flex flex-row gap-2 items-center'>
					<Image
						src={'/proveedores.svg'}
						alt='Logo de Savanna'
						width={30}
						height={100}
						className='cursor-pointer'
					/>
					<p>Proveedores</p>
				</Link>
				<Link href='/' className='flex flex-row gap-2 items-center'>
					<Image
						src={'/reportes.svg'}
						alt='Logo de Savanna'
						width={30}
						height={100}
						className='cursor-pointer'
					/>
					<p>Reportes</p>
				</Link>
			</section>
		</div>
	)
}
