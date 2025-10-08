// src/types/express/index.d.ts

import "express"
import { IAdmin } from "../IAdmin"

declare global {
  namespace Express {
    interface Request {
      admin?: IAdmin
    }
  }
}