import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, "./public/temp")
    },
    filename: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, _file.originalname)
    }
})

export const upload = multer({
    storage
})