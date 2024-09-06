import { useState } from 'react'

export const useMenu = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return {
		isMenuOpen,
		toggleMenu
	}
}

/* <Header onToggleMenu={toggleMenu} />
    <main
        onClick={toggleMenuLeave}></main>
*/

/* On header */
/* interface NavbarProps {
	onToggleMenu: () => void
}

export default function Header({ onToggleMenu }: NavbarProps) {

<button onClick={onToggleMenu}>
	<Image
		src='/menu.svg'
		alt='Menu'
		width={30}
		height={30}
		className='cursor-pointer'
	/>
</button>

 */
