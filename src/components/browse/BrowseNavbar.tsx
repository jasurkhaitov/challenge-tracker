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
		<nav className='md:py-1 px-3 md:px-5 w-full border-b fixed left-0 top-0 z-40 py-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex h-16 max-w-7xl m-auto items-center justify-between'>
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
		</nav>
	)
}
