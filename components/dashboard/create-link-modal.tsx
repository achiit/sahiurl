"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateLinkForm } from "@/components/dashboard/create-link-form"

interface CreateLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

export function CreateLinkModal({ isOpen, onClose, onSuccess }: CreateLinkModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Link</DialogTitle>
          <DialogDescription>
            Shorten a URL and customize how it works
          </DialogDescription>
        </DialogHeader>
        <CreateLinkForm onClose={onClose} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  )
} 