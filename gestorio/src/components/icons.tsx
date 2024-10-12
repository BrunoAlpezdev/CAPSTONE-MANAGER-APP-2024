import React from 'react'

interface MenuIconProps extends React.SVGProps<SVGSVGElement> {}

const MenuIcon: React.FC<MenuIconProps> = (props) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={30}
		height={30}
		fill='none'
		viewBox='0 0 24 24'>
		<path
			className={props.className}
			d='M1 12a1 1 0 0 1 1-1h20a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1ZM1 4a1 1 0 0 1 1-1h20a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1ZM1 20a1 1 0 0 1 1-1h20a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1Z'
		/>
	</svg>
)

export { MenuIcon }
