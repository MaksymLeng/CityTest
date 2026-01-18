import { generateClient } from "aws-amplify/data";
import type {
    Announcement,
    AnnouncementConnection,
    AnnouncementFilterInput,
    Category,
    GraphQLResult
} from "@/lib/interface.ts";

// @ts-ignore
let clientInstance: ReturnType<typeof generateClient> | null = null;

const getClient = () => {
    if (!clientInstance) {
        clientInstance = generateClient();
    }
    // @ts-ignore
    return clientInstance;
}


const QUERIES = {
    listAnnouncements: `
    query ListAnnouncements($limit: Int, $nextToken: String, $filter: AnnouncementFilterInput) {
      listAnnouncements(limit: $limit, nextToken: $nextToken, filter: $filter) {
        items {
          id
          title
          status
          categories
          publicationDate
          lastUpdate
        }
        nextToken
      }
    }
  `,
    getAnnouncement: `
    query GetAnnouncement($id: ID!) {
      getAnnouncement(id: $id) {
        id
        title
        content
        status
        categories
        publicationDate
        lastUpdate
      }
    }
  `,
    createAnnouncement: `
    mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
      createAnnouncement(input: $input) {
        id
        title
        status
        categories
        publicationDate
      }
    }
  `,
    updateAnnouncement: `
    mutation UpdateAnnouncement($input: UpdateAnnouncementInput!) {
      updateAnnouncement(input: $input) {
        id
        title
        status
        lastUpdate
      }
    }
  `,
    deleteAnnouncement: `
    mutation DeleteAnnouncement($id: ID!) {
      deleteAnnouncement(id: $id) {
        id
      }
    }
  `,
    listCategories: `
    query ListCategories {
      listCategories {
        id
        name
        slug
      }
    }
  `,
    createCategory: `
    mutation CreateCategory($input: CreateCategoryInput!) {
      createCategory(input: $input) {
        id
        name
        slug
      }
    }
  `
};

export const api = {
    announcements: {
        list: async (
            limit: number = 20,
            nextToken?: string,
            filter?: AnnouncementFilterInput
        ): Promise<AnnouncementConnection> => {
            const response = await getClient().graphql({
                query: QUERIES.listAnnouncements,
                variables: { limit, nextToken, filter }
            }) as GraphQLResult<{ listAnnouncements: AnnouncementConnection }>;

            return response.data.listAnnouncements;
        },

        get: async (id: string): Promise<Announcement | null> => {
            const response = await getClient().graphql({
                query: QUERIES.getAnnouncement,
                variables: { id }
            }) as GraphQLResult<{ getAnnouncement: Announcement }>;

            return response.data.getAnnouncement;
        },

        create: async (
            title: string,
            content: string,
            categories: string[] = [],
            publicationDate?: string
        ): Promise<Announcement> => {
            const response = await getClient().graphql({
                query: QUERIES.createAnnouncement,
                variables: {
                    input: {
                        title,
                        content,
                        categories,
                        status: "PUBLISHED",
                        publicationDate
                    }
                }
            }) as GraphQLResult<{ createAnnouncement: Announcement }>;

            return response.data.createAnnouncement;
        },

        update: async (id: string, updates: Partial<Announcement>): Promise<Announcement> => {
            const input = {
                id,
                title: updates.title,
                content: updates.content,
                categories: updates.categories,
                status: updates.status
            };

            const response = await getClient().graphql({
                query: QUERIES.updateAnnouncement,
                variables: { input }
            }) as GraphQLResult<{ updateAnnouncement: Announcement }>;

            return response.data.updateAnnouncement;
        },

        delete: async (id: string): Promise<Announcement | null> => {
            const response = await getClient().graphql({
                query: QUERIES.deleteAnnouncement,
                variables: { id }
            }) as GraphQLResult<{ deleteAnnouncement: Announcement }>;

            return response.data.deleteAnnouncement;
        }
    },

    categories: {
        list: async (): Promise<Category[]> => {
            const response = await getClient().graphql({
                query: QUERIES.listCategories
            }) as GraphQLResult<{ listCategories: Category[] }>;

            return response.data.listCategories;
        },

        create: async (name: string, slug: string): Promise<Category> => {
            const response = await getClient().graphql({
                query: QUERIES.createCategory,
                variables: {
                    input: { name, slug }
                }
            }) as GraphQLResult<{ createCategory: Category }>;

            return response.data.createCategory;
        }
    }
};