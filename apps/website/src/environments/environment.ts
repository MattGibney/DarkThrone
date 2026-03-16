const resolveReleaseTag = (...candidates: Array<string | undefined | null>) => {
  for (const candidate of candidates) {
    const normalizedCandidate = candidate?.trim();

    if (normalizedCandidate) {
      return normalizedCandidate;
    }
  }

  return null;
};

const releaseTagEnv = import.meta.env as {
  RELEASE_TAG?: string;
  COOLIFY_BRANCH?: string;
};

export interface Config {
  webAppUrl: string;
  releaseTag: string | null;
}
export const environment: Config = {
  webAppUrl: import.meta.env.VITE_GAME_APP_URL || 'http://localhost:4200',
  releaseTag: resolveReleaseTag(
    releaseTagEnv.RELEASE_TAG,
    releaseTagEnv.COOLIFY_BRANCH,
  ),
};
