import Image from 'next/image'
import { Package } from 'lucide-react'

type props = {
	title: string
}

export function DashboardItem(props: props) {
	return (
		<div className='dashboard-container box-shadow flex-grow border-primary/40 bg-foreground/5 backdrop-blur-md text-foreground rounded-sm'>
			<section className='flex flex-row px-4 mt-2 gap-2'>
				<Package />
				<h2>{props.title}</h2>
			</section>
			<hr className='solid my-2' />
			{/* Tabla */}
			<div className='p-4 w-full flex-grow'>
				<table className='min-w-full text-left bg-background border border-border rounded-lg shadow-md overflow-hidden'>
					<thead className='bg-border text-foreground/90'>
						<tr>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Column 1
							</th>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Column 2
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-border text-foreground'>
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
