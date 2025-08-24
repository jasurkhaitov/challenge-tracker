import { Button } from '../ui/button'
import { ModeToggle } from '../shared/ModeToggle'
import BrandIcon from '../shared/BrandIcon'
import { ArrowLeft, History } from 'lucide-react'
import { UserButton } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ page }: { page?: string }) {
	const navigate = useNavigate()
	return (
		<nav className='md:py-1 px-3 md:px-5 w-full border-b fixed left-0 top-0 z-40 py-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex h-16 items-center max-w-7xl m-auto justify-between'>
				{
					page !== 'create' && <BrandIcon target={'dashboard'} />
				}
				{
					page === 'create' && <Link to='/dashboard'>
						<Button variant='outline'>
							<ArrowLeft className='h-4 w-4' />
							<span className='hidden sm:block'>Back to Home</span>
						</Button>
					</Link>
				}
				<div className='flex items-center space-x-5'>
					<Button variant={'outline'} onClick={() => navigate('/history')}>
						<History /> History
					</Button>

					<UserButton />

					<ModeToggle />
				</div>
			</div>

		</nav>
	)
}