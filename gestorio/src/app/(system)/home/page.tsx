import Image from 'next/image'
export default function HomePage() {
	return (
		<main className='flex flex-col gap-3 justify-center items-center w-full h-full '>
			<h1>Dashboard</h1>
			<section className='grid grid-cols-2 gap-6'>
				<article className='dashboard-container box-shadow'>
					<h2>Ultimas Ventas</h2>
					<p>Here is a list of the latest sales</p>
					<Image
						priority
						width={400}
						height={200}
						src='/mock.png'
						alt='mock-image'
					/>
				</article>
				<article className='dashboard-container box-shadow'>
					<h2>Ultimas Compras</h2>
					<p>Here is a list of the latest purchases</p>
					<Image
						priority
						width={400}
						height={200}
						src='/mock.png'
						alt='mock-image'
					/>
				</article>
				<article className='dashboard-container box-shadow'>
					<h2>Ganancias Mensuales</h2>
					<p>Here is a graphic display of the monthly earnings</p>
					<Image
						priority
						width={400}
						height={200}
						src='/mock.png'
						alt='mock-image'
					/>
				</article>
				<article className='dashboard-container box-shadow'>
					<h2>Calendar</h2>
					<p>Here is a calendar of the month</p>
					<Image
						priority
						width={400}
						height={200}
						src='/mock.png'
						alt='mock-image'
					/>
				</article>
			</section>
		</main>
	)
}
