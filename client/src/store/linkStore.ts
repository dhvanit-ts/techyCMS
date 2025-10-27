import { ILink } from "@/types/ILink";
import { create } from "zustand";

interface LinkState {
  links: ILink[];
  setLinks: (links: ILink[]) => void;
  updateLink: (linkId: string, updatedLink: ILink) => void;
  removeLink: (linkId: string) => void;
  addLink: (link: ILink) => void;
}

const useLinkStore = create<LinkState>((set) => ({
  links: [
    {
      id: "1",
      children: [],
      label: "Home",
      href: "/",
      sectionId: "1",
    },
    {
      id: "2",
      children: [],
      label: "About",
      href: "/",
      sectionId: "1",
    },
    {
      id: "3",
      children: [],
      label: "Contact",
      href: "/",
      sectionId: "1",
    },
  ],
  setLinks: (links) => set({ links }),
  updateLink: (linkId, updatedLink) =>
    set((state) => ({
      links: state.links.map((link) =>
        link.id === linkId ? updatedLink : link
      ),
    })),
  removeLink: (linkId) =>
    set((state) => ({
      links: state.links.filter((link) => link.id !== linkId),
    })),
  addLink: (link) => set((state) => ({ links: [...state.links, link] })),
}));

export default useLinkStore;
