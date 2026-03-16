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

export default {
  gameAPI: import.meta.env.VITE_GAME_API_URL || 'http://localhost:3000',
  releaseTag: resolveReleaseTag(
    releaseTagEnv.RELEASE_TAG,
    releaseTagEnv.COOLIFY_BRANCH,
  ),
};
