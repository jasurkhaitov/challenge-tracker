import React, { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Heart,
	Dumbbell,
	BookOpen,
	Target,
	Brain,
	Palette,
	Users,
	Briefcase,
	DollarSign,
	MoreHorizontal,
} from 'lucide-react'
import ColorInput from './ColorInput'

export type ChallengeFormData = {
	name: string
	goal: string
	category: string
	color: string
}

type ChallengeFormProps = {
	onSubmit: (data: ChallengeFormData) => void
	isSubmitting: boolean
}

const challengeColors = [
	{ name: 'Green', value: '#22c55e' },
	{ name: 'Blue', value: '#3b82f6' },
	{ name: 'Purple', value: '#8b5cf6' },
	{ name: 'Pink', value: '#ec4899' },
	{ name: 'Orange', value: '#f97316' },
	{ name: 'Red', value: '#ef4444' },
	{ name: 'Yellow', value: '#eab308' },
	{ name: 'Teal', value: '#14b8a6' },
	{ name: 'Indigo', value: '#6366f1' },
]

const challengeCategories = [
	{ name: 'Health', icon: Heart },
	{ name: 'Fitness', icon: Dumbbell },
	{ name: 'Learning', icon: BookOpen },
	{ name: 'Productivity', icon: Target },
	{ name: 'Wellness', icon: Brain },
	{ name: 'Creativity', icon: Palette },
	{ name: 'Social', icon: Users },
	{ name: 'Career', icon: Briefcase },
	{ name: 'Finance', icon: DollarSign },
	{ name: 'Other', icon: MoreHorizontal },
]

const ChallengeForm: React.FC<ChallengeFormProps> = ({
	onSubmit,
	isSubmitting,
}) => {
	const [formData, setFormData] = useState<ChallengeFormData>({
		name: '',
		goal: '',
		category: '',
		color: challengeColors[0].value,
	})

	const minDate = new Date()
	minDate.setDate(minDate.getDate() + 100)

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (
			!formData.name ||
			!formData.goal ||
			!formData.category
		) {
			return
		}
		onSubmit(formData)
	}

	const selectedCategoryIcon = challengeCategories.find(
		cat => cat.name === formData.category
	)?.icon

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='space-y-3'>
					<Label htmlFor='name' className='text-sm mb-1 font-medium'>
						Challenge Name *
					</Label>
					<Input
						id='name'
						placeholder='e.g., Daily Exercise, Read Every Day'
						value={formData.name}
						onChange={e =>
							setFormData(prev => ({ ...prev, name: e.target.value }))
						}
						required
						className=''
					/>
				</div>

				<div className='space-y-3'>
					<Label htmlFor='goal' className='text-sm mb-1 font-medium'>
						Goal *
					</Label>
					<Input
						id='goal'
						placeholder='e.g., Exercise for 30 minutes, Read for 20 minutes'
						value={formData.goal}
						onChange={e =>
							setFormData(prev => ({ ...prev, goal: e.target.value }))
						}
						required
						className=''
					/>
				</div>

				<div className='space-y-3'>
					<Label className='text-sm mb-1 font-medium'>Category *</Label>
					<Select
						value={formData.category}
						onValueChange={value =>
							setFormData(prev => ({ ...prev, category: value }))
						}
						required
					>
						<SelectTrigger className=''>
							<SelectValue placeholder='Select a category'>
								{selectedCategoryIcon && (
									<div className='flex items-center gap-2'>
										{React.createElement(selectedCategoryIcon, {
											className: 'h-4 w-4',
										})}
										<span>{formData.category}</span>
									</div>
								)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{challengeCategories.map(category => {
								const IconComponent = category.icon
								return (
									<SelectItem key={category.name} value={category.name}>
										<div className='flex items-center gap-2'>
											<IconComponent className='h-4 w-4' />
											<span>{category.name}</span>
										</div>
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className='md:col-span-1'>
				<ColorInput
					selectedColor={formData.color}
					onColorChange={color => setFormData(prev => ({ ...prev, color }))}
				/>
			</div>

			<div className='flex space-x-4'>
				<Button
					type='button'
					variant='outline'
					className='flex-1 '
					onClick={() => alert('Cancelled')}
				>
					Cancel
				</Button>
				<Button
					type='submit'
					className='flex-1 '
					disabled={
						isSubmitting ||
						!formData.name ||
						!formData.goal ||
						!formData.category
					}
					onClick={handleSubmit}
				>
					{isSubmitting ? 'Creating Challenge...' : 'Create Challenge'}
				</Button>
			</div>
		</div>
	)
}

export default ChallengeForm
