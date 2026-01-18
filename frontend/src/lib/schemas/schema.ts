import * as z from "zod";

export const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    content: z.string().min(2, {
        message: "Content must be at least 2 characters.",
    }),
    categories: z.array(z.string()).min(1, "Select at least one category"),
    publicationDate: z.string().regex(
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4} (0\d|1\d|2[0-3]):[0-5]\d$/,
        "Invalid date format. Use MM/DD/YYYY HH:mm"
    ),
});