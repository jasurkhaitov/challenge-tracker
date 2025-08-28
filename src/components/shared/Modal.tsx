import React, { useEffect, useRef } from 'react'
import { XIcon } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  overlayClassName?: string
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  showCloseButton = true
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])


  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${overlayClassName}`}
        data-state={isOpen ? 'open' : 'closed'}
        onClick={handleOverlayClick}
      />

      <div
        ref={modalRef}
        tabIndex={-1}
        className={`bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg ${className}`}
        data-state={isOpen ? 'open' : 'closed'}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {children}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="ring-offset-background focus:ring-ring data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            data-state={isOpen ? 'open' : 'closed'}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </div>
  )
}

export function ModalHeader({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-2 text-center sm:text-left ${className}`}>
      {children}
    </div>
  )
}

export function ModalFooter({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className}`}>
      {children}
    </div>
  )
}

export function ModalTitle({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2 className={`text-lg leading-none font-semibold ${className}`}>
      {children}
    </h2>
  )
}

export function ModalDescription({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={`text-muted-foreground text-sm ${className}`}>
      {children}
    </p>
  )
}