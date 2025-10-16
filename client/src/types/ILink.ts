export interface Link {
  id: string;
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  sectionId: string;
  parentId?: string;
  children?: Link[];
}

export interface Section {
  id: string;
  type: SectionType;
  mode: SectionMode;
  links: Link[];
  customHtml?: string;
  customCss?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SectionType {
  HEADER = "HEADER",
  FOOTER = "FOOTER",
}

export enum SectionMode {
  NORMAL = "NORMAL",
  CUSTOM = "CUSTOM",
}
