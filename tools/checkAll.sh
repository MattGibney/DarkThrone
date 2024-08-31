set -e

npx nx reset
npx nx run-many -t lint --all --maxWorkers=50%
npx nx run-many -t test --all --maxWorkers=50%
npx nx run-many -t build --all --maxWorkers=50%
