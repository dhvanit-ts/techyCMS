import { ILink } from "@/types/ILink";
import { create } from "zustand";

interface LinkState {
  links: ILink[];
  setLinks: (links: ILink[]) => void;
  updateLink: (linkId: string, updatedLink: ILink) => void;
  removeLink: (linkId: string) => void;
  addLink: (link: ILink) => void;
  updateLinkVisibilityStatus: (linkId: string) => void;
}

const useLinkStore = create<LinkState>((set) => ({
  links: [],
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
  updateLinkVisibilityStatus: (linkId) =>
    set((state) => ({
      links: state.links.map((link) =>
        link.id === linkId ? { ...link, active: !link.active } : link
      ),
    })),
}));

export default useLinkStore;
