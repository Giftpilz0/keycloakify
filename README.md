# keycloakify

[![ci](https://github.com/Giftpilz0/keycloakify/actions/workflows/ci.yml/badge.svg)](https://github.com/Giftpilz0/keycloakify/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Login theme `nixpi` for my Keycloak 26, built with [Keycloakify](https://keycloakify.dev) and Tailwind.

## Usage

Download `keycloak-theme.jar` from the [latest release](https://github.com/Giftpilz0/keycloakify/releases/latest),
put it into Keycloak's `providers/` and select the login theme `nixpi`.

## Development

```sh
just storybook   # all login pages with mock data on :6006
just build       # dist_keycloak/keycloak-theme.jar
```

Every page uses `src/login/Template.tsx` and the Tailwind classes in `src/login/classes.ts`; only
`Login`, `LoginOtp` and `LoginConfigTotp` are custom pages. Every push to `main` that passes CI is
released as `v0.0.N`. Run `just` for all recipes and `just check` before committing.
Conventions: [Giftpilz0/shared](https://github.com/Giftpilz0/shared).

## License

[MIT](LICENSE)
