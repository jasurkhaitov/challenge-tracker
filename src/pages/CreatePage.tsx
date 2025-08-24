import Create from '@/components/create/Create'
import Navbar from '@/components/shared/Navbar'

export default function CreatePage() {
	return (
		<div className='min-h-screen flex items-center justify-center max-w-7xl m-auto px-4 bg-background'>
			<Navbar page='create' />

			<div className='w-full'>
				<Create />
			</div>
		</div>
	)
}
