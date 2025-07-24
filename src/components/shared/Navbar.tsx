import { Button } from '../ui/button'
import { ModeToggle } from '../shared/ModeToggle'
import BrandIcon from '../shared/BrandIcon'
import { History } from 'lucide-react'
import { UserButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
	const navigate = useNavigate()
	return (
		<nav className='border-b bg-background/50 backdrop-blur-md fixed w-full top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					<BrandIcon target={'dashboard'} />
					<div className='flex items-center space-x-5'>
						<Button variant={'outline'} onClick={() => navigate('/history')}>
							<History /> History
						</Button>

						<UserButton />

						<ModeToggle />
					</div>
				</div>
			</div>
		</nav>
	)
}
