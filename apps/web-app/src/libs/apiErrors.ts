export function extractApiErrorCodes<T extends string>(
  error: unknown,
): T[] | null {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('errors' in error) ||
    !Array.isArray((error as { errors?: unknown }).errors)
  ) {
    return null;
  }

  const errors = (error as { errors: unknown[] }).errors.filter(
    (code): code is T => typeof code === 'string',
  );

  return errors.length > 0 ? errors : null;
}

export function getApiErrorMessages<T extends string>(
  error: unknown,
  fallbackCode: T,
): T[] {
  return extractApiErrorCodes<T>(error) ?? [fallbackCode];
}
