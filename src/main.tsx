import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './providers/theme-provider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import { dark } from '@clerk/themes'
import { Toaster } from './components/ui/sonner.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

if (!PUBLISHABLE_KEY) {
	throw new Error('Missing Publishable Key')
}

const savedTheme = localStorage.getItem('vite-ui-theme')

let baseTheme
if (savedTheme === 'dark') {
	baseTheme = dark
} else if (savedTheme === 'system') {
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
	baseTheme = prefersDark ? dark : undefined
} else {
	baseTheme = undefined
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{ baseTheme }}>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
					<BrowserRouter>
						<App />
						<Toaster />
					</BrowserRouter>
				</ThemeProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	</StrictMode>
)
