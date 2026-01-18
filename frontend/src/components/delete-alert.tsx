import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteAlertProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function DeleteAlert({ open, onOpenChange, onConfirm }: DeleteAlertProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-14 flex flex-col items-center text-center gap-6 border-none shadow-xl">

                <div
                    className={cn(
                        "w-20 h-20 rounded-full border-4 flex items-center justify-center",
                        "border-red-500 bg-red-50 dark:bg-red-900/20"
                    )}
                >
                    <Trash2 className="w-10 h-10 text-red-500 stroke-[3]" />
                </div>

                <DialogHeader className="w-full flex flex-col items-center gap-2">
                    <DialogTitle className="text-center text-md font-normal text-gray-700 dark:text-gray-200 leading-relaxed">
                        Delete Announcement
                    </DialogTitle>

                    <DialogDescription className="text-center text-sm text-gray-600 dark:text-slate-400">
                        Are you sure you want to delete this announcement? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="w-full flex sm:justify-center gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 font-semibold"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold"
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}