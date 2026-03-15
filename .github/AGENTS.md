# GitHub Workflow Notes

- Deployment jobs should prefer the object form of `jobs.<job_id>.environment`, setting both `name` and `url` so GitHub deployments expose a clickable target link.
- For release-driven deploys, keep the environment mapping aligned with the release type: prereleases deploy to `staging`, full releases deploy to `production`.
- Prefer GitHub repository or organization variables for deployment URLs used by `environment.url`; avoid hardcoding them in workflow YAML.
- This workspace expects `STAGING_DEPLOYMENT_URL` and `PRODUCTION_DEPLOYMENT_URL` to hold the primary clickable targets for GitHub deployments.
- Keep `.github/workflows/coolify-release-deploy.yml` aligned with `tools/coolify-release-deploy.sh`.
