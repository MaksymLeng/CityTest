import type {AnnouncementStatus} from "@/lib/type.ts";

export interface Announcement {
    id: string;
    title: string;
    publicationDate: string;
    lastUpdate: string;
    categories: string[];
    content?: string;
    status: AnnouncementStatus;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface AnnouncementConnection {
    items: Announcement[];
    nextToken: string | null;
}



export interface AnnouncementFilterInput {
    categories?: string[];
    status?: AnnouncementStatus | null;
}

export interface GraphQLResult<T> {
    data: T;
    errors?: any[];
}
