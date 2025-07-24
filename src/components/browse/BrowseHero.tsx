import { cn } from '@/lib/utils'

import img1 from '../../assets/img/screen_1.png'
import img2 from '../../assets/img/screen_2.webp'
import img3 from '../../assets/img/screen_3.webp'
import img4 from '../../assets/img/screen_4.webp'
import img5 from '../../assets/img/screen_5.webp'
import img6 from '../../assets/img/screen_6.webp'

interface Screenshot {
	src: string
	alt: string
	minBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

interface ScreenshotGridProps {
	screenshots?: Screenshot[]
	className?: string
	animationDelay?: number
}

const screenshots: Screenshot[] = [
	{
		src: img1,
		alt: 'Habit Tracker HabitKit Screen: Habit overview',
	},
	{
		src: img2,
		alt: 'Habit Tracker HabitKit screens: Widgets',
		minBreakpoint: 'sm',
	},
	{
		src: img3,
		alt: 'Habit Tracker HabitKit screens: Habit overview',
		minBreakpoint: 'md',
	},
	{
		src: img4,
		alt: 'Habit Tracker HabitKit screens: Statistics',
		minBreakpoint: 'lg',
	},
	{
		src: img5,
		alt: 'Habit Tracker HabitKit screens: Share with friends',
		minBreakpoint: 'xl',
	},
	{
		src: img6,
		alt: 'Habit Tracker HabitKit screens: Calendar Screen',
		minBreakpoint: '2xl',
	},
]

const getVisibilityClass = (minBreakpoint?: string) => {
	if (!minBreakpoint) return ''

	const breakpointMap = {
		sm: 'hidden sm:block',
		md: 'hidden md:block',
		lg: 'hidden lg:block',
		xl: 'hidden xl:block',
		'2xl': 'hidden 2xl:block',
	}

	return breakpointMap[minBreakpoint as keyof typeof breakpointMap] || ''
}

export default function BrowseHero({
	screenshots: customScreenshots,
	className,
	animationDelay = 0.3,
}: ScreenshotGridProps) {
	const screenshotsToUse = customScreenshots || screenshots

	return (
		<section
			className={cn(
				'py-10 px-4',
				'items-center animate-fade-up opacity-0',
				className
			)}
			style={{
				animationDelay: `${animationDelay}s`,
				animationFillMode: 'forwards',
			}}
		>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 container mx-auto max-w-7xl'>
				{screenshotsToUse.map((screenshot, index) => (
					<div
						key={`${screenshot.src}-${index}`}
						className={cn(
							'group cursor-pointer',
							getVisibilityClass(screenshot.minBreakpoint)
						)}
					>
						<img
							src={screenshot.src}
							alt={screenshot.alt}
							width={400}
							height={800}
							className='w-full transition-transform duration-300 ease-in-out group-hover:scale-105'
							sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw'
						/>
					</div>
				))}
			</div>
		</section>
	)
}
