import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { ModeToggle } from '../shared/ModeToggle'
import BrandIcon from '../shared/BrandIcon'
import { Contact, Loader2 } from 'lucide-react'
import { useConvexAuth } from 'convex/react'
import { UserButton } from '@clerk/clerk-react'
import { useTheme } from '@/providers/theme-provider'
import { dark } from '@clerk/themes'

export default function BrowseNavbar({
	available = 'browse',
}: {
	available?: string
}) {
	const navigate = useNavigate()

	const { theme } = useTheme()

	const { isLoading, isAuthenticated } = useConvexAuth()

	return (
		<nav className='border-b bg-background/50 backdrop-blur-md fixed w-full top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					<BrandIcon />
					<div className='flex items-center space-x-4'>
						{available === 'browse' && (
							<>
								{isLoading ? (
									<Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
								) : isAuthenticated ? (
									<UserButton
										appearance={{
											baseTheme: theme === 'dark' ? dark : undefined,
										}}
									/>
								) : (
									<>
										<Button
											className='hidden sm:block'
											onClick={() => navigate('/login')}
											variant='outline'
										>
											Login
										</Button>
										<Button
											className='hidden sm:block'
											onClick={() => navigate('/register')}
										>
											Start Free
										</Button>
									</>
								)}
							</>
						)}

						<ModeToggle />
						<a
							href='https://t.me/jasurkhaitov'
							target='_blank'
							rel='noopener noreferrer'
						>
							<Button variant='outline'>
								<Contact />
							</Button>
						</a>
					</div>
				</div>
			</div>
		</nav>
	)
}
