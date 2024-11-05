interface LandingCardProps {
	title: string
	description: string
	image: string
	icon: React.ReactNode
}

export function LandingCard(props: LandingCardProps) {
	return (
		<div className='group relative cursor-pointer items-center justify-center overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/30 rounded-md'>
			<div className='h-50 w-50'>
				<img src={props.image} alt='' />
			</div>
			<div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70'></div>

			{/* Contenedor de logo y título que se mueve hacia arriba con hover */}
			<div className='absolute inset-0 flex flex-col items-center justify-center px-9 text-center transition-all duration-500 group-hover:-translate-y-10'>
				{props.icon}
				<h1 className='mb-6 text-2xl font-bold text-primary'>{props.title}</h1>
			</div>

			{/* Descripción que aparece con el hover */}
			<div className='absolute inset-0 flex flex-col items-center px-9 text-center transition-all duration-500 opacity-0 group-hover:translate-y-24 group-hover:opacity-100 translate-y-44'>
				<p className='mb-2 text-lg italic text-white'>{props.description}</p>
			</div>
		</div>
	)
}
