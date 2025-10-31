import { Request, Response } from "express";
import prisma from "../db/index";

export const updateLink = async (req: Request, res: Response) => {
  try {
    const link = await prisma.link.findUnique({
      where: { id: req.params.id },
    });

    if (link) {
      const updatedLink = await prisma.link.update({
        where: { id: req.params.id },
        data: req.body,
      });
      return res.status(201).json({ data: updatedLink });
    } else {
      return res.status(404).json({ error: "Link not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update link" });
  }
};

function buildLinkTree(links: any[]) {
  const linkMap = new Map();
  const tree: any[] = [];

  // First, create a map of all links
  links.forEach(link => {
    linkMap.set(link.id, { ...link, children: [] });
  });

  // Then, build the tree structure
  links.forEach(link => {
    const node = linkMap.get(link.id);
    if (link.parentId === null) {
      tree.push(node);
    } else {
      const parent = linkMap.get(link.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return tree;
}

export const getLinksBySection = async (req: Request, res: Response) => {
  try {
    const links = await prisma.link.findMany({
      where: {
        sectionId: req.params.sectionId,
      },
      orderBy: [
        { parentId: "asc" },
        { order: "asc" }
      ],
    });
    
    const linkTree = buildLinkTree(links);
    return res.status(200).json({ data: linkTree });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to retrieve links" });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  try {
    const link = await prisma.link.findUnique({
      where: { id: req.params.id },
    });
    if (link) {
      await prisma.link.delete({
        where: { id: req.params.id },
      });
      return res.status(200).json({ message: "Link deleted successfully" });
    } else {
      return res.status(404).json({ error: "Link not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to delete link" });
  }
};

export const createLink = async (req: Request, res: Response) => {
  try {
    const { href, label, children, parentId, sectionId, rel, target } =
      req.body;

    console.log(req.body);

    const count = await prisma.link.count({
      where: { sectionId, parentId: parentId ?? null },
    });

    const newLink = await prisma.link.create({
      data: {
        href,
        label,
        children,
        parentId,
        sectionId,
        rel,
        target,
        order: count,
      },
    });
    return res
      .status(201)
      .json({ message: "Link created successfully", data: newLink });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to create link" });
  }
};

export const getLink = async (req: Request, res: Response) => {
  try {
    const link = await prisma.link.findUnique({
      where: { id: req.params.id },
    });
    if (link) {
      return res.status(200).json({ data: link });
    } else {
      return res.status(404).json({ error: "Link not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to retrieve link" });
  }
};

export const updateLinksOrder = async (req: Request, res: Response) => {
  try {
    const { links }: { links: any[] } = req.body;
    const { sectionId } = req.params;

    if (!Array.isArray(links)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Each link must include id, parentId, and order
    await prisma.$transaction(
      links.map((link) => {
        return prisma.link.update({
          where: { id: link.id },
          data: {
            parentId: link.parentId ?? null,
            order: link.order,
          },
        });
      })
    );

    return res
      .status(200)
      .json({ message: "Links order updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update links order" });
  }
};

export const changeVisibilityStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (link) {
      await prisma.link.update({
        where: { id },
        data: { active },
      });
      return res.status(200).json({ message: "Visibility status updated" });
    } else {
      return res.status(404).json({ error: "Link not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Failed to update visibility status" });
  }
};
