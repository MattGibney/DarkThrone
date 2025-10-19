set -e

npx nx reset
NX_TUI=false npx nx run-many -t lint --all --maxWorkers=50%
NX_TUI=false npx nx run-many -t test --all --maxWorkers=50%
NX_TUI=false npx nx run-many -t build --all --maxWorkers=50%
