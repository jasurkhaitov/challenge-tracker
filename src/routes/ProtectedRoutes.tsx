import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LifeLine from "react-loading-indicators/Lifeline"

import { useConvexAuth } from 'convex/react'

export default function ProtectedRoute() {
	const { isAuthenticated, isLoading } = useConvexAuth()
	const location = useLocation()

	if (isLoading) {
		return (
			<div className='w-full h-screen flex items-center justify-center'>
				<LifeLine size='small' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
			</div>
		)
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' state={{ from: location }} replace />
	}

	return <Outlet />
}
