export interface ILink {
  id: string;
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  sectionId: string;
  parentId?: string | null;
  order?: number;
  active: boolean;
  children?: ILink[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISection {
  id: string;
  type: SectionType;
  mode: SectionMode;
  links: ILink[];
  profile: string;
  logo: string;
  tabsPlacement: "left" | "center" | "right";
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
