import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Category } from "@/lib/interface.ts";
import {LoadingComponent} from "@/components/loading-component.tsx";
import {formSchema} from "@/lib/schemas/schema.ts";


export default function AddPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [openCategory, setOpenCategory] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            categories: [],
            publicationDate: format(new Date(), "MM/dd/yyyy HH:mm"),
        },
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoading(true);
                const categories = await api.categories.list();
                setAvailableCategories(categories);
            } catch (error) {
                console.error(error);
                toast.error("Error loading categories");
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const dateObj = new Date(values.publicationDate);

            if (isNaN(dateObj.getTime())) {
                form.setError("publicationDate", { message: "Invalid date value" });
                return;
            }

            const createPromise = api.announcements.create(
                values.title,
                values.content || "",
                values.categories,
                dateObj.toISOString()
            );

            toast.promise(createPromise, {
                loading: 'Creating announcement...',
                success: () => {
                    navigate("/announcements");
                    return 'Announcement created successfully';
                },
                error: 'Failed to create announcement',
            });

        } catch (error) {
            console.error(error);
        }
    }

    if (isLoading) {
        return <LoadingComponent/>;
    }

    return (
        <div className="container max-w-2xl mx-auto mb:py-6">
            <div className="mb-10">
                <h1 className="text-3xl font-bold">Create new announcement</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Type your content here."
                                        className="h-40 resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Category</FormLabel>
                                <div className="text-sm text-muted-foreground mb-2">
                                    Select category so readers know what your announcement is about.
                                </div>
                                <Popover open={openCategory} onOpenChange={setOpenCategory}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between h-auto min-h-10",
                                                    !field.value?.length && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value?.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {field.value.map((item) => (
                                                            <Badge
                                                                variant="secondary"
                                                                key={item}
                                                                className="mr-1 mb-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    field.onChange(field.value?.filter((value) => value !== item));
                                                                }}
                                                            >
                                                                {item}
                                                                <X className="ml-1 h-3 w-3 hover:text-destructive cursor-pointer" />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    "Select categories"
                                                )}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search category..." />
                                            <CommandList>
                                                <CommandEmpty>No category found.</CommandEmpty>
                                                <CommandGroup>
                                                    {availableCategories.map((category) => (
                                                        <CommandItem
                                                            value={category.name}
                                                            key={category.id}
                                                            onSelect={() => {
                                                                const current = field.value || [];
                                                                if (current.includes(category.name)) {
                                                                    field.onChange(current.filter((val) => val !== category.name));
                                                                } else {
                                                                    field.onChange([...current, category.name]);
                                                                }
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value?.includes(category.name)
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="publicationDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Publication date</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="MM/DD/YYYY HH:mm"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Format: MM/DD/YYYY HH:mm (e.g., 08/10/2023 08:55)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => navigate("/announcements")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-400 hover:bg-orange-500 text-white min-w-[100px] cursor-pointer"
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}