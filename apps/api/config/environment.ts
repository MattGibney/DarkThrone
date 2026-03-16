const resolveReleaseTag = (...candidates: Array<string | undefined | null>) => {
  for (const candidate of candidates) {
    const normalizedCandidate = candidate?.trim();

    if (normalizedCandidate) {
      return normalizedCandidate;
    }
  }

  return null;
};

export type Config = {
  port: string;
  webApp: {
    origin: string;
  };
  jwtSecret: string;
  logtailSourceToken: string;
  logLevel?: string;
  releaseTag: string | null;
};

const config: Config = {
  port: process.env.API_PORT,
  webApp: {
    origin: process.env.WEBAPP_ORIGIN,
  },
  jwtSecret: process.env.JWT_SECRET,
  logtailSourceToken: process.env.LOGTAIL_SOURCE_TOKEN,
  logLevel: process.env.LOG_LEVEL || 'info',
  releaseTag: resolveReleaseTag(
    process.env.RELEASE_TAG,
    process.env.COOLIFY_BRANCH,
  ),
};

export default config;
