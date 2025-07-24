import { Link } from 'react-router-dom'
import Logo from '../../assets/habitkit_transparent.webp'

export default function BrandIcon({ target }: { target?: string }) {
	return (
		<Link
			to={target === 'dashboard' ? '/dashboard' : '/'}
			className='flex items-center space-x-3'
		>
			<img
				className='w-10 h-10 flex items-center gap-2'
				src={Logo}
				alt='Logo'
			/>
			<span className='hidden xs:block text-xl font-bold font-montserrat text-foreground'>
				JasX
			</span>
		</Link>
	)
}
