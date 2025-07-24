import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import React, { useRef, useState, useEffect } from 'react'

export const BackgroundBeamsWithCollision = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const parentRef = useRef<HTMLDivElement>(null)

	const beams = [
		{
			initialX: 10,
			translateX: 10,
			duration: 3,
			repeatDelay: 1,
			delay: 0,
			className: 'h-16 w-0.5',
		},
		{
			initialX: 80,
			translateX: 120,
			duration: 2.5,
			repeatDelay: 0.5,
			delay: 0.5,
			className: 'h-8 w-px',
		},
		{
			initialX: 200,
			translateX: 180,
			duration: 4,
			repeatDelay: 1.5,
			delay: 1,
			className: 'h-12 w-0.5',
		},
		{
			initialX: 320,
			translateX: 350,
			duration: 2,
			repeatDelay: 0.8,
			delay: 1.5,
			className: 'h-20 w-px',
		},
		{
			initialX: 450,
			translateX: 420,
			duration: 3.5,
			repeatDelay: 1.2,
			delay: 0.3,
			className: 'h-6 w-0.5',
		},
		{
			initialX: 580,
			translateX: 600,
			duration: 2.8,
			repeatDelay: 0.9,
			delay: 2,
			className: 'h-24 w-px',
		},
		{
			initialX: 720,
			translateX: 680,
			duration: 3.2,
			repeatDelay: 1.1,
			delay: 0.7,
			className: 'h-10 w-0.5',
		},
		{
			initialX: 850,
			translateX: 800,
			duration: 2.3,
			repeatDelay: 0.6,
			delay: 1.8,
			className: 'h-18 w-px',
		},
		{
			initialX: 980,
			translateX: 1000,
			duration: 4.2,
			repeatDelay: 1.3,
			delay: 0.9,
			className: 'h-14 w-0.5',
		},
		{
			initialX: 1100,
			translateX: 1150,
			duration: 2.7,
			repeatDelay: 0.7,
			delay: 2.5,
			className: 'h-8 w-px',
		},
		{
			initialX: 1250,
			translateX: 1200,
			duration: 3.8,
			repeatDelay: 1.4,
			delay: 1.2,
			className: 'h-22 w-0.5',
		},
		{
			initialX: 1380,
			translateX: 1400,
			duration: 2.1,
			repeatDelay: 0.4,
			delay: 0.1,
			className: 'h-12 w-px',
		},
		{
			initialX: 1500,
			translateX: 1480,
			duration: 3.6,
			repeatDelay: 1.6,
			delay: 1.7,
			className: 'h-16 w-0.5',
		},
		{
			initialX: 1620,
			translateX: 1650,
			duration: 2.4,
			repeatDelay: 0.8,
			delay: 0.4,
			className: 'h-10 w-px',
		},
		{
			initialX: 1750,
			translateX: 1720,
			duration: 4.5,
			repeatDelay: 1.7,
			delay: 2.3,
			className: 'h-20 w-0.5',
		},
	]

	return (
		<div
			ref={parentRef}
			className={cn(
				'relative flex items-center min-h-screen w-full justify-center overflow-hidden',
				className
			)}
		>
			{beams.map(beam => (
				<CollisionMechanism
					key={beam.initialX + 'beam-idx'}
					beamOptions={beam}
					containerRef={containerRef}
					parentRef={parentRef}
				/>
			))}

			{children}
			<div
				ref={containerRef}
				className='absolute bottom-0 bg-neutral-100 w-full inset-x-0 pointer-events-none'
				style={{
					boxShadow:
						'0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
				}}
			></div>
		</div>
	)
}

const CollisionMechanism = React.forwardRef<
	HTMLDivElement,
	{
		containerRef: React.RefObject<HTMLDivElement | null>
		parentRef: React.RefObject<HTMLDivElement | null>
		beamOptions?: {
			initialX?: number
			translateX?: number
			initialY?: number
			translateY?: number
			rotate?: number
			className?: string
			duration?: number
			delay?: number
			repeatDelay?: number
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ parentRef, containerRef, beamOptions = {} }, _ref) => {
	const beamRef = useRef<HTMLDivElement>(null)
	const [collision, setCollision] = useState<{
		detected: boolean
		coordinates: { x: number; y: number } | null
	}>({
		detected: false,
		coordinates: null,
	})
	const [beamKey, setBeamKey] = useState(0)
	const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false)

	useEffect(() => {
		const checkCollision = () => {
			if (
				beamRef.current &&
				containerRef.current &&
				parentRef.current &&
				!cycleCollisionDetected
			) {
				const beamRect = beamRef.current.getBoundingClientRect()
				const containerRect = containerRef.current.getBoundingClientRect()
				const parentRect = parentRef.current.getBoundingClientRect()

				if (beamRect.bottom >= containerRect.top) {
					const relativeX = beamRect.left - parentRect.left + beamRect.width / 2
					const relativeY = beamRect.bottom - parentRect.top

					setCollision({
						detected: true,
						coordinates: {
							x: relativeX,
							y: relativeY,
						},
					})
					setCycleCollisionDetected(true)
				}
			}
		}

		const animationInterval = setInterval(checkCollision, 16)

		return () => clearInterval(animationInterval)
	}, [cycleCollisionDetected, containerRef, parentRef])

	useEffect(() => {
		if (collision.detected && collision.coordinates) {
			setTimeout(() => {
				setCollision({ detected: false, coordinates: null })
				setCycleCollisionDetected(false)
			}, 2000)

			setTimeout(() => {
				setBeamKey(prevKey => prevKey + 1)
			}, 2000)
		}
	}, [collision])

	return (
		<>
			<motion.div
				key={beamKey}
				ref={beamRef}
				animate='animate'
				initial={{
					translateY: beamOptions.initialY || '-200px',
					translateX: beamOptions.initialX || '0px',
					rotate: beamOptions.rotate || 0,
				}}
				variants={{
					animate: {
						translateY: beamOptions.translateY || '1800px',
						translateX: beamOptions.translateX || '0px',
						rotate: beamOptions.rotate || 0,
					},
				}}
				transition={{
					duration: beamOptions.duration || 8,
					repeat: Infinity,
					repeatType: 'loop',
					ease: 'linear',
					delay: beamOptions.delay || 0,
					repeatDelay: beamOptions.repeatDelay || 0,
				}}
				className={cn(
					'absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-500 via-pink-400 to-transparent shadow-lg shadow-purple-500/20',
					beamOptions.className
				)}
			/>
			<AnimatePresence>
				{collision.detected && collision.coordinates && (
					<Explosion
						key={`${collision.coordinates.x}-${collision.coordinates.y}`}
						className=''
						style={{
							left: `${collision.coordinates.x}px`,
							top: `${collision.coordinates.y}px`,
							transform: 'translate(-50%, -50%)',
						}}
					/>
				)}
			</AnimatePresence>
		</>
	)
})

CollisionMechanism.displayName = 'CollisionMechanism'

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
	const spans = Array.from({ length: 20 }, (_, index) => ({
		id: index,
		initialX: 0,
		initialY: 0,
		directionX: Math.floor(Math.random() * 80 - 40),
		directionY: Math.floor(Math.random() * -50 - 10),
	}))

	return (
		<div {...props} className={cn('absolute z-50 h-2 w-2', props.className)}>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 1.5, ease: 'easeOut' }}
				className='absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm'
			></motion.div>
			{spans.map(span => (
				<motion.span
					key={span.id}
					initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
					animate={{
						x: span.directionX,
						y: span.directionY,
						opacity: 0,
					}}
					transition={{ duration: Math.random() * 1.5 + 0.5, ease: 'easeOut' }}
					className='absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500'
				/>
			))}
		</div>
	)
}
