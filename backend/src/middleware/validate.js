/**
 * Zod validation middleware.
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'params' | 'query'} source
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: result.error.flatten().fieldErrors,
      });
    }
    // In Express 5 (ESM strict mode), req.query and req.params are read-only getters.
    // Only reassign req.body, which is writable and benefits from coercion/defaults.
    if (source === 'body') req.body = result.data;
    next();
  };
}
