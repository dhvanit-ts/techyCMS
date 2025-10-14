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