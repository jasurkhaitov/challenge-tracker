import { useState, useEffect } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { CircleCheck, EllipsisVertical, Trash2 } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Id } from 'convex/_generated/dataModel'
import { Modal, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from '../shared/Modal'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'
import { Progress } from '../ui/progress'

interface ChallengeActionsProps {
	challengeId: Id<'challenges'>,
	stats: {
		total: number,
		completion: number,
		missed: number
	}
}

export default function ChallengeActions({ challengeId, stats }: ChallengeActionsProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	const [showCompleteDialog, setShowCompleteDialog] = useState(false)

	const [deleteConfirmText, setDeleteConfirmText] = useState("")

	const deleteChallenge = useMutation(api.challenges.deleteChallenge)
	const completeChallenge = useMutation(api.challenges.completeChallenge)

	useEffect(() => {
		if (!showDeleteDialog) {
			setDeleteConfirmText("")
		}
	}, [showDeleteDialog])

	const handleDeleteClick = () => setShowDeleteDialog(true)
	const handleConfirmDelete = async () => {
		if (deleteConfirmText === "Delete Challenge") {
			try {
				await deleteChallenge({ id: challengeId })
				toast.success("Challenge deleted successfully")
				setShowDeleteDialog(false)
			} catch (err) {
				toast.error("Failed to delete challenge")
				console.error(err)
			}
		}
	}
	const isDeleteConfirmValid = deleteConfirmText === "Delete Challenge"

	const handleCompleteClick = () => setShowCompleteDialog(true)
	const handleConfirmComplete = async () => {
		try {
			await completeChallenge({ challengeId })
			toast.success("Challenge completed successfully 🎉")
			setShowCompleteDialog(false)
		} catch (err) {
			toast.error("Failed to complete challenge")
			console.error(err)
		}
	}

	const percent = stats.total > 0
		? Math.round((stats.completion / stats.total) * 100)
		: 0

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild className='border-none outline-none ring-0'>
					<Button className='border-none outline-none ring-0' variant={'ghost'}>
						<EllipsisVertical />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-red-500 cursor-pointer hover:text-red-300 focus:text-red-500"
						onClick={handleDeleteClick}
					>
						<Trash2 className="w-5 h-5 text-red-500" /> Delete Challenge
					</DropdownMenuItem>
					<DropdownMenuItem
						className="text-green-600 cursor-pointer hover:text-green-400 focus:text-green-700"
						onClick={handleCompleteClick}
					>
						<CircleCheck className="w-5 h-5 text-green-600" /> Complete Challenge
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Modal isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} className="sm:max-w-[425px]">
				<ModalHeader>
					<ModalTitle className="text-red-600">Delete Challenge</ModalTitle>
					<ModalDescription>
						This action cannot be undone. This will permanently delete the challenge
						and all its progress data.
					</ModalDescription>
				</ModalHeader>

				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<label htmlFor="confirm-text" className="text-sm mb-1 font-medium">
							Type <span className="font-mono bg-muted px-1 py-0.5 rounded">Delete Challenge</span> to confirm:
						</label>
						<Input
							id="confirm-text"
							value={deleteConfirmText}
							onChange={(e) => setDeleteConfirmText(e.target.value)}
							placeholder="Delete Challenge"
							className="w-full"
							autoFocus
						/>
					</div>
				</div>

				<ModalFooter>
					<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
					<Button variant="destructive" onClick={handleConfirmDelete} disabled={!isDeleteConfirmValid}>
						Delete Challenge
					</Button>
				</ModalFooter>
			</Modal>

			<Modal isOpen={showCompleteDialog} onClose={() => setShowCompleteDialog(false)} className="sm:max-w-[425px]">
				<ModalHeader>
					<ModalTitle className="text-green-600">Complete Challenge</ModalTitle>
					<ModalDescription>
						Review your challenge stats before completing it.
					</ModalDescription>
				</ModalHeader>

				<>
					<div className="flex items-center justify-between text-sm">
						<span className="font-medium text-foreground">Progress</span>
						<span className="text-muted-foreground">{percent}%</span>
					</div>
					<Progress value={percent} className="h-2 rounded-full" />
				</>

				<div className="grid gap-3 py-4 text-sm">
					<div className="flex justify-between"><span>Total Days:</span><span>{stats.total}</span></div>
					<div className="flex justify-between"><span>Completed:</span><span>{stats.completion}</span></div>
					<div className="flex justify-between"><span>Missed:</span><span>{stats.missed}</span></div>
				</div>

				<ModalFooter>
					<Button variant="outline" onClick={() => setShowCompleteDialog(false)}>Cancel</Button>
					<Button onClick={handleConfirmComplete}>
						Mark as Completed
					</Button>
				</ModalFooter>
			</Modal>
		</>
	)
}
