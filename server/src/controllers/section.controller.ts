import { Request, Response } from "express";
import prisma from "../db";
import { buildLinkTree } from "../utils/buildLinkTree";

export const getSections = async (req: Request, res: Response) => {};

export const createSection = async (req: Request, res: Response) => {
  try {
    const { type, customCss, customHtml, links, mode } = req.body;

    const newSection = await prisma.section.create({
      data: {
        type,
        customCss,
        customHtml,
        links,
        mode,
      },
    });

    if (!newSection) {
      return res.status(500).json({ error: "Failed to create section" });
    }

    return res
      .status(201)
      .json({ message: "Section created successfully", data: newSection });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to create section" });
  }
};

export const getSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const section = await prisma.section.findUnique({
      where: {
        id,
      },
      include: {
        links: {
          orderBy: [{ parentId: "asc" }, { order: "asc" }],
        },
      },
    });

    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    const links = buildLinkTree(section.links);
    return res.status(200).json({ data: { ...section, links } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to get section" });
  }
};
