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
import type {Announcement, Category} from "@/lib/interface.ts";
import {Check, ChevronsUpDown, Pencil, Trash2} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/table-skeleton.tsx";
import { DeleteAlert } from "@/components/delete-alert.tsx";
import { TablePagination } from "@/components/table-pagination";
import {cn} from "@/lib/utils.ts";
import {useIsMobile} from "@/hooks/use-mobile.ts";

export default function Page() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [openCategory, setOpenCategory] = useState(false);

    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageTokens, setPageTokens] = useState<Record<number, string | undefined>>({});
    const [hasNextPage, setHasNextPage] = useState(false);

    const isMobile = useIsMobile()
    const ITEMS_PER_PAGE = isMobile ? 6 : 10;
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await api.categories.list();
                setCategories(cats);
            } catch (e) {
                console.error("Failed to load categories", e);
            }
        };
        loadCategories();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const tokenToUse = page === 1 ? undefined : pageTokens[page];

            if (page > 1 && !tokenToUse) {
                setPage(p => p - 1);
                return;
            }

            const filterInput = selectedCategory
                ? { categories: [selectedCategory] }
                : undefined;

            const data = await api.announcements.list(ITEMS_PER_PAGE, tokenToUse, filterInput);

            setAnnouncements(data?.items || []);

            if (data.nextToken) {
                setPageTokens(prev => ({
                    ...prev,
                    [page + 1]: data.nextToken || undefined
                }));
                setHasNextPage(true);
            } else {
                setHasNextPage(false);
            }

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

    const handleCategorySelect = (categoryName: string) => {
        const newValue = categoryName === selectedCategory ? "" : categoryName;

        setSelectedCategory(newValue);
        setPage(1);
        setPageTokens({});
        setOpenCategory(false);
    };

    useEffect(() => {
        fetchAnnouncements();
    }, [page, selectedCategory, ITEMS_PER_PAGE]);

    const simulatedTotalPages = hasNextPage ? page + 1 : page;

    return (
        <div className="mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-semibold tracking-tight">Announcements</h1>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCategory}
                                className="w-[170px] md:w-[200px] justify-between"
                            >
                                {selectedCategory
                                    ? categories.find((cat) => cat.name === selectedCategory)?.name
                                    : "Filter by category..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[170px] p-0">
                            <Command>
                                <CommandInput placeholder="Search category..." />
                                <CommandList>
                                    <CommandEmpty>No category found.</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value="all"
                                            onSelect={() => handleCategorySelect("")}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCategory === "" ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            All Categories
                                        </CommandItem>
                                        {categories.map((category) => (
                                            <CommandItem
                                                key={category.id}
                                                value={category.name}
                                                onSelect={() => {
                                                    handleCategorySelect(category.name);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedCategory === category.name ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {category.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    <Button onClick={() => navigate("/announcements/new")} className="cursor-pointer ml-2">
                        Add Announcement
                    </Button>
                </div>
            </div>
            <div className="border-b overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[70vh] scrollbar-thin">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="mb:w-[300px] lg:pl-6 font-semibold">Title</TableHead>
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
                                        <TableCell className="font-medium lg:pl-6 max-w-[100px] md:max-w-[200px] lg:max-w-[300px] xl:max-w-none truncate">
                                            {item.title}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDate(item.publicationDate)}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDate(item.lastUpdate)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 md:w-40 w-32 md:w-auto">
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

            {!loading && announcements.length > 0 && (
                <TablePagination
                    currentPage={page}
                    totalPages={simulatedTotalPages}
                    onPageChange={(newPage) => {
                        if (Math.abs(newPage - page) === 1) {
                            setPage(newPage);
                        }
                    }}
                />
            )}

            <DeleteAlert
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}