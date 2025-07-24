import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useConvexAuth } from 'convex/react'
import { Loader } from 'lucide-react'

export default function ProtectedRoute() {
	const { isAuthenticated, isLoading } = useConvexAuth()
	const location = useLocation()

	if (isLoading) {
		return (
			<div className='w-full h-screen flex items-center justify-center'>
				<Loader className='text-blue-600 animate-spin w-10 h-10' />
			</div>
		)
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' state={{ from: location }} replace />
	}

	return <Outlet />
}
