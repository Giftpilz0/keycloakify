set shell := ["bash", "-euo", "pipefail", "-c"]

# List recipes
default:
    @just --list --unsorted

# Run all linters and formatters (pre-commit, includes tsc); CI runs this too
lint *args:
    bun install --frozen-lockfile
    pre-commit run --all-files {{args}}

# Definition of done: lint and build the theme
check: lint build

# Vite dev server (page mocks: just storybook)
dev:
    bun run dev

# All login pages with mock data on :6006
storybook:
    bun run storybook

# Build the Keycloak 26 theme into dist_keycloak/keycloak-theme.jar
build:
    bun install --frozen-lockfile
    bun run build-keycloak-theme

# Remove build output
clean:
    rm -rf dist dist_keycloak storybook-static
