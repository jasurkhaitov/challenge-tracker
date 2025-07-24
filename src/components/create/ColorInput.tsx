import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const challengeColors = [
	{ name: 'Green', value: '#22c55e' },
	{ name: 'Blue', value: '#3b82f6' },
	{ name: 'Purple', value: '#8b5cf6' },
	{ name: 'Pink', value: '#ec4899' },
	{ name: 'Orange', value: '#f97316' },
	{ name: 'Red', value: '#ef4444' },
	{ name: 'Yellow', value: '#eab308' },
]

const ColorInput = ({
	selectedColor,
	onColorChange,
}: {
	selectedColor: string
	onColorChange: (color: string) => void
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [customColor, setCustomColor] = useState('#6366f1')
	const [isCustomColorSelected, setIsCustomColorSelected] = useState(false)

	const handleColorSelect = (colorValue: string) => {
		onColorChange(colorValue)
		setIsCustomColorSelected(false)
	}

	const handleCustomColorChange = (color: string) => {
		setCustomColor(color)
	}

	const handleCustomColorConfirm = () => {
		onColorChange(customColor)
		setIsCustomColorSelected(true)
		setIsModalOpen(false)
	}

	const isPresetColorSelected =
		challengeColors.some(color => color.value === selectedColor) &&
		!isCustomColorSelected

	return (
		<div className='space-y-3'>
			<Label className='text-base font-medium'>Color Theme</Label>
			<div className='flex flex-wrap gap-3'>
				{challengeColors.map(color => (
					<button
						key={color.value}
						type='button'
						className={cn(
							'w-10 h-10 rounded-full border-3 transition-all hover:scale-110',
							selectedColor === color.value && isPresetColorSelected
								? 'border-foreground scale-110 shadow-lg'
								: 'border-muted-foreground/30'
						)}
						style={{ backgroundColor: color.value }}
						onClick={() => handleColorSelect(color.value)}
						title={color.name}
					/>
				))}

				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogTrigger asChild>
						<button
							type='button'
							className={cn(
								'w-10 h-10 rounded-full border-3 border-dashed transition-all hover:scale-110 flex items-center justify-center',
								isCustomColorSelected
									? 'border-foreground scale-110 shadow-lg'
									: 'border-muted-foreground/50'
							)}
							style={{
								backgroundColor: isCustomColorSelected
									? selectedColor
									: 'transparent',
							}}
							title='Custom color'
						>
							{isCustomColorSelected ? null : <Plus className='h-4 w-4' />}
						</button>
					</DialogTrigger>

					<DialogContent className='sm:max-w-md'>
						<DialogHeader>
							<DialogTitle>Choose Custom Color</DialogTitle>
						</DialogHeader>

						<div className='space-y-6 py-4'>
							<div className='flex items-center justify-center'>
								<div
									className='w-24 h-24 rounded-full border-4 border-muted-foreground/30 shadow-lg'
									style={{ backgroundColor: customColor }}
								/>
							</div>

							<div className='space-y-3'>
								<Label
									htmlFor='custom-color-picker'
									className='text-sm font-medium'
								>
									Select Color:
								</Label>
								<input
									id='custom-color-picker'
									type='color'
									value={customColor}
									onChange={e => handleCustomColorChange(e.target.value)}
									className='w-full h-12 rounded-lg border-2 border-muted-foreground/30 cursor-pointer'
								/>
							</div>

							<div className='space-y-2'>
								<Label className='text-sm font-medium'>Hex Value:</Label>
								<input
									type='text'
									value={customColor}
									onChange={e => handleCustomColorChange(e.target.value)}
									className='w-full px-3 py-2 border border-muted-foreground/30 rounded-md text-sm font-mono'
									placeholder='#000000'
								/>
							</div>

							<div className='flex gap-3 pt-4'>
								<Button
									variant='outline'
									onClick={() => setIsModalOpen(false)}
									className='flex-1'
								>
									Cancel
								</Button>
								<Button
									onClick={handleCustomColorConfirm}
									className='flex-1'
									style={{ backgroundColor: customColor, color: '#fff' }}
								>
									Apply Color
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}

export default ColorInput
