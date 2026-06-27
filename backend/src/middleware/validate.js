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
    req[source] = result.data; // replace with coerced/defaulted values
    next();
  };
}
