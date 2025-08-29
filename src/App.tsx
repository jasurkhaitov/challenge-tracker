import { Navigate, Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"
import ProtectedRoute from "./routes/ProtectedRoutes"
import { LifeLine } from 'react-loading-indicators'

const BrowsePage = lazy(() => import("./pages/BrowsePage"))
const LoginPage = lazy(() => import("./pages/LoginPage"))
const RegisterPage = lazy(() => import("./pages/RegisterPage"))
const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const HistoryPage = lazy(() => import("./pages/HistoryPage"))
const CreatePage = lazy(() => import("./pages/CreatePage"))

export default function App() {
	return (
		<Suspense fallback={<div className='w-full h-screen flex items-center justify-center'>
			<LifeLine size='small' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
		</div>}>
			<Routes>
				<Route path="/" element={<BrowsePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />

				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/history" element={<HistoryPage />} />
					<Route path="/create" element={<CreatePage />} />
				</Route>

				<Route path="*" element={<Navigate to={"/"} />} />
			</Routes>
		</Suspense>
	)
}