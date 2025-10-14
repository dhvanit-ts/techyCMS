import { Request, Response, NextFunction } from "express";
import { ApiResponse, AsyncHandler } from "../utils/ApiHelpers";
import prisma from "../db/index";

export const getComponents = async (req: Request, res: Response) => {
  try {
    const components = await prisma.component.findMany();
    return res.status(200).json({ data: components });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to retrieve pages" });
  }
};

export const createComponent = async (req: Request, res: Response) => {
  try {
    const { name, html, css, category } = req.body;
    const newComponent = await prisma.component.create({
      data: {
        name,
        html,
        category,
        css,
      },
    });
    return res
      .status(201)
      .json({ message: "Component created successfully", data: newComponent });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to create component" });
  }
};

export const deleteComponent = async (req: Request, res: Response) => {
  try {
    const component = await prisma.component.findUnique({
      where: { id: req.params.id },
    });
    if (component) {
      await prisma.component.delete({
        where: { id: req.params.id },
      });
      return res.status(200).json({ message: "Component deleted successfully" });
    } else {
      return res.status(404).json({ error: "Component not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to delete component" });
  }
};

export const updateComponent = async (req: Request, res: Response) => {
  try {
    const component = await prisma.component.findUnique({
      where: { id: req.params.id },
    });
    if (component) {
      const updatedComponent = await prisma.component.update({
        where: { id: req.params.id },
        data: req.body,
      });
      return res.status(201).json({ data: updatedComponent });
    } else {
      return res.status(404).json({ error: "Component not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update component" });
  }
};