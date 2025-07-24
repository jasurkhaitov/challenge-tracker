import EmptyDashboard from '@/components/dashboard/EmptyDashboard'
import Navbar from '@/components/shared/Navbar'

export default function DashboardPage() {
	return (
		<>
			<Navbar />

			<div className=''>
				<EmptyDashboard />
			</div>
		</>
	)
}
