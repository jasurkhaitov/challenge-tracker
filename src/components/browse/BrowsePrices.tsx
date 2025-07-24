import { Check, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion, type Variants } from 'framer-motion'
import { useConvexAuth } from 'convex/react'
import { useNavigate } from 'react-router-dom'

const plans = [
	{
		name: 'Start',
		description: 'Perfect for solo challenge tracking',
		monthlyPrice: 0,
		features: [
			'Create up to 3 challenges',
			'Basic calendar view',
			'Category-based badges',
			'Color selection for challenges',
		],
		popular: false,
	},
	{
		name: 'Pro',
		description: 'Unlock advanced challenge features',
		monthlyPrice: 38,
		features: [
			'Unlimited challenges',
			'GitHub-style progress graph',
			'Advanced badge collections',
			'Streak tracking & XP system',
			'Challenge templates',
		],
		popular: true,
	},
	{
		name: 'Business',
		description: 'Built for small teams & communities',
		monthlyPrice: 56,
		features: [
			'Team challenges & leaderboards',
			'Shared challenge dashboards',
			'Advanced analytics & progress reports',
			'Multiple category badges',
			'Support for team XP levels',
		],
		popular: false,
	},
	{
		name: 'Enterprise',
		description: 'For organizations & coaching platforms',
		monthlyPrice: 72,
		features: [
			'White-label dashboard',
			'Custom branding & domains',
			'Full API access',
			'Challenge automation',
			'Dedicated account manager',
		],
		popular: false,
	},
]

export default function BrowsePrices() {
	const { isAuthenticated, isLoading } = useConvexAuth()

	const navigate = useNavigate()

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.2,
			},
		},
	}

	const cardVariants: Variants = {
		hidden: { opacity: 0, y: 50, scale: 0.9 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: [0.25, 0.1, 0.25, 1],
			},
		},
	}

	const popularCardVariants: Variants = {
		hidden: { opacity: 0, y: 50, scale: 0.9 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.7,
				ease: [0.25, 0.1, 0.25, 1],
				type: 'spring',
				stiffness: 100,
			},
		},
	}

	const featureVariants: Variants = {
		hidden: { opacity: 0, x: -20 },
		visible: (index: number) => ({
			opacity: 1,
			x: 0,
			transition: {
				delay: index * 0.1,
				duration: 0.4,
			},
		}),
	}

	return (
		<section className='py-24 px-4'>
			<div className='container mx-auto max-w-7xl'>
				<motion.div
					className='text-center mb-16'
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<motion.h1
						className='text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4'
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						Pricing
					</motion.h1>
					<motion.p
						className='text-lg text-muted-foreground max-w-2xl mx-auto mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						Choose the perfect plan to track your habits and unlock your
						potential.
					</motion.p>
				</motion.div>

				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'
					variants={containerVariants}
					initial='hidden'
					animate='visible'
				>
					{plans.map((plan, index) => (
						<motion.div
							key={index}
							variants={plan.popular ? popularCardVariants : cardVariants}
							whileHover={{
								y: -5,
								transition: { duration: 0.2 },
							}}
							className='h-full'
						>
							<Card
								className={cn(
									'relative flex flex-col h-full',
									plan.popular
										? 'border-green-500 shadow-lg scale-100 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10'
										: 'border-border'
								)}
							>
								{plan.popular && (
									<motion.div
										initial={{ opacity: 0, scale: 0, y: 10 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
									>
										<Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-blue-600 text-white border-0'>
											Popular
										</Badge>
									</motion.div>
								)}

								<CardHeader className='text-center pb-8'>
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.5 + index * 0.1 }}
									>
										<CardTitle className='text-sm font-medium tracking-widest uppercase text-muted-foreground mb-2'>
											{plan.name}
										</CardTitle>
									</motion.div>

									<motion.div
										className='flex items-baseline justify-center'
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{
											delay: 0.6 + index * 0.1,
											duration: 0.5,
											type: 'spring',
											stiffness: 200,
										}}
									>
										<span className='text-5xl font-bold text-foreground'>
											{plan.monthlyPrice === 0
												? 'Free'
												: `$${plan.monthlyPrice}`}
										</span>
										{plan.monthlyPrice > 0 && (
											<span className='text-lg font-normal text-muted-foreground ml-1'>
												/mo
											</span>
										)}
									</motion.div>

									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.7 + index * 0.1 }}
									>
										<CardDescription className='mt-2'>
											{plan.description}
										</CardDescription>
									</motion.div>
								</CardHeader>

								<CardContent className='flex-1'>
									<ul className='space-y-3'>
										{plan.features.map((feature, featureIndex) => (
											<motion.li
												key={featureIndex}
												className='flex items-center'
												custom={featureIndex}
												variants={featureVariants}
												initial='hidden'
												animate='visible'
											>
												<motion.div
													className='flex-shrink-0 w-4 h-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mr-3'
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													transition={{
														delay: 0.8 + index * 0.1 + featureIndex * 0.1,
														type: 'spring',
													}}
												>
													<Check className='w-3 h-3 text-white' />
												</motion.div>
												<span className='text-sm text-muted-foreground'>
													{feature}
												</span>
											</motion.li>
										))}
									</ul>
								</CardContent>

								<CardFooter className='pt-3'>
									<motion.div className='w-full' whileTap={{ scale: 0.98 }}>
										<Button
											className={cn(
												'w-full group',
												isLoading && 'cursor-not-allowed opacity-50',
												plan.popular
													? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
													: 'bg-foreground hover:bg-secondary/80 text-background'
											)}
											disabled={isLoading}
											onClick={() =>
												navigate(isAuthenticated ? '/dashboard' : '/login')
											}
										>
											{isLoading ? (
												<Loader className='w-5 h-5 animate-spin' />
											) : isAuthenticated ? (
												'Get Started'
											) : (
												'Sign in'
											)}
										</Button>
									</motion.div>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
