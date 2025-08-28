import { useState } from "react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from '../shared/Modal'

interface DeleteChallengeModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	challengeName: string
}

export default function DeleteChallengeModal({ isOpen, onClose, onConfirm, challengeName }: DeleteChallengeModalProps) {
	const [deleteConfirmText, setDeleteConfirmText] = useState("")

	const isDeleteConfirmValid = deleteConfirmText === "Delete Challenge"

	const handleConfirmDelete = () => {
		if (isDeleteConfirmValid) {
			onConfirm()
			setDeleteConfirmText("")
		}
	}

	const handleClose = () => {
		setDeleteConfirmText("")
		onClose()
	}

	return (
		<Modal isOpen={isOpen} onClose={handleClose} className="sm:max-w-[425px]">
			<ModalHeader>
				<ModalTitle className="text-red-600">Delete Completed Challenge</ModalTitle>
				<ModalDescription>
					This action cannot be undone. This will permanently delete the challenge "{challengeName}".
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
				<Button variant="outline" onClick={handleClose}>Cancel</Button>
				<Button variant="destructive" onClick={handleConfirmDelete} disabled={!isDeleteConfirmValid}>
					Delete Challenge
				</Button>
			</ModalFooter>
		</Modal>
	)
}