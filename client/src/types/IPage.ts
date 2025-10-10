export interface IPage {
    id: string;
    title: string;
    slug: string;
    html: string;
    css: string;
    status: "draft" | "published";
    metadata: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}