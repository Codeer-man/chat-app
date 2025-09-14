import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validation =
  (Schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = Schema.safeParse(req.body);

    if (!result.success) {
      // 👇 use issues instead of message
      const issues = result.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path,
      }));

      res.status(400).json({
        success: false,
        errors: issues,
        message:"validation failed"
      });
      return;
    }

    req.body = result.data;
    next();
  };
