import { SignIn } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { useTheme } from '@/providers/theme-provider'
import BrowseNavbar from '@/components/browse/BrowseNavbar'

export default function LoginPage() {
	const { theme } = useTheme()

	return (
		<>
			<BrowseNavbar available='login' />
			<div className='w-full h-screen flex items-center justify-center'>
				<SignIn
					appearance={{
						baseTheme: theme === 'dark' ? dark : undefined,
					}}
					path='/login'
					routing='path'
					signUpUrl='/register'
				/>
			</div>
		</>
	)
}
