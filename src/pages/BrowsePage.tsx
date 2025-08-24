import BrowseHeader from '@/components/browse/BrowseHeader'
import BrowseHero from '@/components/browse/BrowseHero'
import BrowseNavbar from '@/components/browse/BrowseNavbar'
import BrowsePrices from '@/components/browse/BrowsePrices'
import Footer from '@/components/shared/Footer'

export default function BrowsePage() {
	return (
		<div className='overflow-x-hidden min-h-screen max-w-7xl m-auto px-4 bg-background'>
			<BrowseNavbar />
			<BrowseHeader />
			<BrowseHero />
			<BrowsePrices />
			<div className='hidden sm:block'>
				<Footer />
			</div>
		</div>
	)
}
