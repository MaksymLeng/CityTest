import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const TablePagination = ({currentPage, totalPages, onPageChange}: TablePaginationProps) => {
    return (
        <div className="flex items-center justify-end px-6 gap-6 text-sm pt-6">
            <div className="min-w-[80px] text-center font-medium">
                Page {currentPage} of {totalPages || 1}
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};