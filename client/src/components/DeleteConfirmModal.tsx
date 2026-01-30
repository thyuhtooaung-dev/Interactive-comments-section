import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-100 p-6 rounded-lg">
        <DialogHeader className="flex flex-col text-start gap-4">
          <DialogTitle className="text-xl font-bold text-slate-700">
            Delete comment
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Are you sure you want to delete this comment? This will remove the
            comment and can't be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between gap-3 mt-4">
          <Button
            className="flex-1 bg-gray-500 hover:bg-gray-400 text-white font-bold py-5 uppercase cursor-pointer"
            onClick={onClose}
          >
            No, Cancel
          </Button>

          <Button
            disabled={isPending}
            className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-5 uppercase cursor-pointer"
            onClick={onConfirm}
          >
            {isPending ? "..." : "Yes, Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
