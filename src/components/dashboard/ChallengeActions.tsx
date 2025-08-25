import { useState, useEffect } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { CircleCheck, EllipsisVertical, Trash2 } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Id } from 'convex/_generated/dataModel'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

interface ChallengeActionsProps {
	challengeId: Id<'challenges'>
}

export default function ChallengeActions({ challengeId }: ChallengeActionsProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	const [deleteConfirmText, setDeleteConfirmText] = useState("")

	const deleteChallenge = useMutation(api.challenges.deleteChallenge)
	const completeChallenge = useMutation(api.challenges.completeChallenge)

	useEffect(() => {
		if (!showDeleteDialog) {
			setDeleteConfirmText("")
			document.body.style.overflow = 'unset'
			document.body.style.paddingRight = '0px'
		}
	}, [showDeleteDialog])

	const handleDeleteClick = () => {
		setShowDeleteDialog(true)
	}

	const handleConfirmDelete = () => {
		if (deleteConfirmText === "delete challenge") {
			deleteChallenge({ id: challengeId })
			closeDialog()
		}
	}

	const closeDialog = () => {
		setShowDeleteDialog(false)
		setDeleteConfirmText("")
		setTimeout(() => {
			document.body.style.overflow = 'unset'
			document.body.style.paddingRight = '0px'
		}, 100)
	}

	// const handleDialogChange = (open: boolean) => {
	// 	if (!open) {
	// 		closeDialog()
	// 	} else {
	// 		setShowDeleteDialog(true)
	// 	}
	// }

	const handleComplete = () => {
		completeChallenge({ challengeId })
	}

	const isDeleteConfirmValid = deleteConfirmText === "delete challenge"

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
						className="text-red-500 cursor-pointer hover:text-red-400 focus:text-red-700"
						onClick={handleDeleteClick}
					>
						<Trash2 className="w-5 h-5 text-red-500" /> Delete Challenge
					</DropdownMenuItem>
					<DropdownMenuItem
						className="text-green-600 cursor-pointer hover:text-green-600 focus:text-green-700"
						onClick={handleComplete}
					>
						<CircleCheck className="w-5 h-5 text-green-600" /> Complete Challenge
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle className="text-red-600">Delete Challenge</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the challenge
							and all its progress data.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<label htmlFor="confirm-text" className="text-sm font-medium">
								Type <span className="font-mono bg-muted px-1 py-0.5 rounded">delete challenge</span> to confirm:
							</label>
							<Input
								id="confirm-text"
								value={deleteConfirmText}
								onChange={(e) => setDeleteConfirmText(e.target.value)}
								placeholder="delete challenge"
								className="w-full"
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={closeDialog}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleConfirmDelete}
							disabled={!isDeleteConfirmValid}
						>
							<Trash2 className="w-4 h-4 mr-2" />
							Delete Challenge
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}