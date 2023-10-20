import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (e) {
      if (e instanceof ZodError)
        return res.status(500).json({ error: e.message });
      return res.status(500).json({ error: "something went wrong" });
    }
  };

export default validateResource;
