import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

type Source = 'body' | 'params' | 'query';

export function validate(schema: ZodSchema, source: Source = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }
    // In Express 5 (ESM strict mode), req.query and req.params are read-only getters.
    // Only reassign req.body, which is writable and benefits from coercion/defaults.
    if (source === 'body') req.body = result.data;
    next();
  };
}
