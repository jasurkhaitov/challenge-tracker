import React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

type CalendarPickerProps = {
	selectedDate: Date
	onDateChange: (date: Date | undefined) => void
	minDate: Date
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
	selectedDate,
	onDateChange,
	minDate,
}) => {
	return (
		<div className='space-y-3'>
			<Label className='text-base font-medium'>Deadline *</Label>
			<p className='text-sm text-muted-foreground'>
				Choose a date at least 100 days from today to ensure a meaningful
				long-term challenge.
			</p>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className={cn(
							'w-full h-12 justify-start text-left font-normal',
							!selectedDate && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className='mr-2 h-5 w-5' />
						{selectedDate
							? format(selectedDate, 'PPP')
							: 'Pick a deadline (minimum 100 days from today)'}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						mode='single'
						selected={selectedDate}
						onSelect={onDateChange}
						disabled={date => date > minDate}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}

export default CalendarPicker
