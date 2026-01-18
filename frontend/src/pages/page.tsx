import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Announcement } from "@/lib/interface.ts";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/table-skeleton.tsx";
import { DeleteAlert } from "@/components/delete-alert.tsx";

export default function Page() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await api.announcements.list();
            setAnnouncements(data.items);
        } catch (error) {
            console.error("Error loading announcements:", error);
            toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        const id = deleteId;
        setDeleteId(null);

        try {
            const promise = api.announcements.delete(id);
            toast.promise(promise, {
                loading: 'Deleting...',
                success: () => {
                    fetchAnnouncements();
                    return 'Announcement deleted';
                },
                error: 'Error deleting announcement',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    return (
        <div className="mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-semibold tracking-tight">Announcements</h1>
                </div>
                <Button onClick={() => navigate("/announcements/new")} className="cursor-pointer">
                    Add Announcement
                </Button>
            </div>

            <div className="border-b overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[70vh] scrollbar-thin">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px] lg:pl-6 font-semibold">Title</TableHead>
                                <TableHead className="font-semibold">Publication date</TableHead>
                                <TableHead className="font-semibold">Last update</TableHead>
                                <TableHead className="font-semibold">Categories</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableSkeleton />
                            ) : announcements.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No announcements found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                announcements.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <TableCell className="font-medium lg:pl-6">
                                            {item.title}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDate(item.publicationDate)}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDate(item.lastUpdate)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 w-40 md:w-auto">
                                                {item.categories?.map((cat) => (
                                                    <span
                                                        key={cat}
                                                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground"
                                                    >
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right lg:pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer"
                                                    onClick={() => navigate(`/announcements/${item.id}`)}
                                                >
                                                    <Pencil className="h-4 w-4 hover:text-primary" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                                    onClick={() => setDeleteId(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <DeleteAlert
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}