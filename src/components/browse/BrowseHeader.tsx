import { Grid3X3, Loader2, TrendingUp } from 'lucide-react'
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useConvexAuth } from 'convex/react'

export default function BrowseHeader() {
	const navigate = useNavigate()
	const { isLoading, isAuthenticated } = useConvexAuth()

	return (
		<BackgroundBeamsWithCollision>
			<section className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 -z-10' />
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30 lg:py-32'>
					<div className='grid lg:grid-cols-2 gap-12 items-center'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, ease: 'easeOut' }}
							className='text-center lg:text-left'
						>
							<h1 className='text-4xl sm:text-5xl font-extrabold bg-gradient-to-l from-green-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight'>
								Track Progress Visually
							</h1>

							<p className='text-base text-muted-foreground mb-4 m-auto max-w-2xl'>
								Stay consistent and crush your goals with our visual grid
								system. Each dot represents a day completed, and every pattern
								tells the story of your commitment.
							</p>

							<div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
								{isLoading ? (
									<Button
										size='lg'
										disabled
										className='bg-gradient-to-r w-32 from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
									>
										<Loader2 className='w-5 h-5 animate-spin text-white' />
									</Button>
								) : isAuthenticated ? (
									<Button
										size='lg'
										onClick={() => navigate('/dashboard')}
										className='bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
									>
										Go to Dashboard
									</Button>
								) : (
									<>
										<Button
											size='lg'
											onClick={() => navigate('/register')}
											className='bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
										>
											Start Free
										</Button>
										<Button
											size='lg'
											onClick={() => navigate('/login')}
											variant='outline'
										>
											Login
										</Button>
									</>
								)}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, ease: 'easeOut' }}
							className='relative'
						>
							<div className='relative bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl xs:rounded-2xl p-4 xs:p-8 shadow-2xl border dark:border-border'>
								<div className='grid grid-cols-1 gap-4'>
									<Card className='p-4 bg-card/80 backdrop-blur-sm border'>
										<div className='flex items-center justify-between mb-3'>
											<span className='text-sm font-medium text-foreground'>
												Challenge Grid View
											</span>
											<span className='text-xs text-muted-foreground'>
												This Week
											</span>
										</div>
										<div className='space-y-4'>
											{['Fitness', 'Reading', 'Meditation'].map(
												(challenge, index) => {
													const colors = [
														'bg-green-500',
														'bg-blue-500',
														'bg-purple-500',
													]
													const completedDays = [5, 6, 4]

													return (
														<div
															key={challenge}
															className='flex items-center justify-between'
														>
															<div className='flex items-center space-x-2'>
																<div
																	className={`w-3 h-3 rounded-full ${colors[index]}`}
																/>
																<span className='text-sm text-foreground'>
																	{challenge}
																</span>
															</div>
															<div className='flex space-x-1'>
																{Array.from({ length: 7 }, (_, i) => (
																	<div
																		key={i}
																		className={`w-3 h-3 rounded-full ${
																			i < completedDays[index]
																				? colors[index]
																				: 'bg-muted-foreground/20'
																		}`}
																	/>
																))}
															</div>
														</div>
													)
												}
											)}
										</div>
									</Card>

									<Card className='p-4 bg-card/80 backdrop-blur-sm border'>
										<div className='flex items-center space-x-2 mb-3'>
											<TrendingUp className='h-4 w-4 text-blue-500 animate-spin-slow' />
											<span className='text-sm font-medium text-foreground'>
												Pattern Recognition
											</span>
										</div>
										<div className='flex justify-between items-center'>
											<span className='text-xs text-muted-foreground'>
												Longest streak: 12 days
											</span>
											<div className='flex space-x-1'>
												{[6, 4, 8].map((height, index) => (
													<div
														key={index}
														className='w-2 rounded-sm'
														style={{
															height: `${height * 2}px`,
															backgroundColor: [
																'#10b981',
																'#3b82f6',
																'#8b5cf6',
															][index],
														}}
													/>
												))}
											</div>
										</div>
									</Card>
								</div>

								<div className='absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-blue-600 text-white p-2 rounded-full'>
									<Grid3X3 className='h-4 w-4' />
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>
		</BackgroundBeamsWithCollision>
	)
}
