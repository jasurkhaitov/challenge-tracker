import { Navigate, Route, Routes } from 'react-router-dom'
import BrowsePage from './pages/BrowsePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './routes/ProtectedRoutes'
import HistoryPage from './pages/HistoryPage'
import CreatePage from './pages/CreatePage'

export default function App() {
	return (
		<Routes>
			<Route path='/' element={<BrowsePage />} />
			<Route path='/login' element={<LoginPage />} />
			<Route path='/register' element={<RegisterPage />} />

			<Route element={<ProtectedRoute />}>
				<Route path='/dashboard' element={<DashboardPage />} />
				<Route path='/history' element={<HistoryPage />} />
				<Route path='/create' element={<CreatePage />} />
			</Route>

			<Route path='*' element={<Navigate to={'/'} />} />
		</Routes>
	)
}
