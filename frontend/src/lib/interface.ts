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

export interface ModelStringInput {
    ne?: string;
    eq?: string;
    le?: string;
    lt?: string;
    ge?: string;
    gt?: string;
    contains?: string;
    notContains?: string;
    beginsWith?: string;
    in?: string[];
    between?: string[];
}

export interface AnnouncementFilterInput {
    categories?: ModelStringInput;
    status?: AnnouncementStatus | null;
}

export interface GraphQLResult<T> {
    data: T;
    errors?: any[];
}
