import { Request, Response } from "express";
import prisma from "../db";

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
