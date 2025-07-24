import BrandIcon from './BrandIcon'

export default function Footer() {
	return (
		<footer className='border-t bg-background/50 backdrop-blur-md'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					<BrandIcon />

					<div className='flex items-center text-sm text-gray-400 sm:border-l sm:border-gray-800 sm:pl-4 sm:ml-4'>
						<span className='font-montserrat'>
							2025 © JasX. All rights reserved. —
						</span>
						<a
							href='https://t.me/jasurkhaitov'
							target='_blank'
							rel='noopener noreferrer'
							className='ml-1 text-blue-500 hover:text-gray-300 transition-colors'
						>
							@jasurkhaitov
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
