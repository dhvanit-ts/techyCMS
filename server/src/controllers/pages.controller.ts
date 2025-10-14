import { Request, Response } from "express";
import prisma from "../db/index";

export const getPages = async (req: Request, res: Response) => {
  try {
    const pages = await prisma.page.findMany();
    return res.status(200).json({ data: pages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to retrieve pages" });
  }
};

export const getPage = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: req.params.slug, status: "published" },
    });
    if (page) {
      return res.status(200).json({ data: page });
    } else {
      return res.status(404).json({ error: "Page not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to retrieve page" });
  }
};

export const publishPage = async (req: Request, res: Response) => {};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id: req.params.id },
    });
    if (page) {
      const updatedPage = await prisma.page.update({
        where: { id: req.params.id },
        data: req.body,
      });
      return res.status(201).json({ data: updatedPage });
    } else {
      return res.status(404).json({ error: "Page not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update page" });
  }
};

export const savePage = async (req: Request, res: Response) => {
  try {
    const { title, slug, html, css, status, metadata } = req.body;

    if (!title || !slug || !html || !css || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
        html,
        css,
        status,
        metadata: { ...metadata },
      },
    });
    return res
      .status(201)
      .json({ message: "Page created successfully", data: newPage });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create page" });
  }
};

export const deletePage = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: req.params.slug },
    });
    if (page) {
      await prisma.page.delete({
        where: { slug: req.params.slug },
      });
      return res.status(200).json({ message: "Page deleted successfully" });
    } else {
      return res.status(404).json({ error: "Page not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to delete page" });
    }
  }
};
