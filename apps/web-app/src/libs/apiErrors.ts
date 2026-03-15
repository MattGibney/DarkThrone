type APIErrorLike = {
  errors?: string[];
};

export function getAPIErrorCodes(error: unknown): string[] {
  if (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as APIErrorLike).errors)
  ) {
    return ((error as APIErrorLike).errors ?? []).filter(
      (errorCode): errorCode is string => typeof errorCode === 'string',
    );
  }

  return [];
}

export function hasAPIErrorCode(error: unknown, errorCode: string): boolean {
  return getAPIErrorCodes(error).includes(errorCode);
}

export function extractApiErrorCodes<T extends string>(
  error: unknown,
): T[] | null {
  const errors = getAPIErrorCodes(error) as T[];

  return errors.length > 0 ? errors : null;
}

export function getApiErrorMessages<T extends string>(
  error: unknown,
  fallbackCode: T,
): T[] {
  return extractApiErrorCodes<T>(error) ?? [fallbackCode];
}
