import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                    <TableCell className="lg:pl-6">
                        <Skeleton className="h-5 w-[200px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[140px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[140px]" />
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                    </TableCell>
                    <TableCell className="lg:pr-6">
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}