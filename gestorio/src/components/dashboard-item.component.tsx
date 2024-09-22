import Image from 'next/image'

type props = {
	title: string
}

export function DashboardItem(props: props) {
	return (
		<div className='dashboard-container box-shadow flex-grow'>
			<section className='flex flex-row px-4 mt-2 gap-2'>
				<Image alt='Block Icon' src='/block.svg' width={20} height={20} />
				<h2>{props.title}</h2>
			</section>
			<hr className='solid my-2' />
			{/* Tabla */}
			<div className='p-4 w-full flex-grow'>
				<table className='min-w-full text-left bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden'>
					<thead className='bg-gray-100 text-Gris/80'>
						<tr>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Column 1
							</th>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Column 2
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 text-Gris'>
						<tr>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium '>
								Row 1, Column 1
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm '>
								Row 1, Column 2
							</td>
						</tr>
						<tr>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium '>
								Row 2, Column 1
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm '>
								Row 2, Column 2
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}
