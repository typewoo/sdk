## 3.0.1 (2025-12-05)

### 🚀 Features

- update README to reflect new SDK structure and installation instructions ([334f8bd](https://github.com/typewoo/sdk/commit/334f8bd))

### ❤️ Thank You

- kmakris23

# 3.0.0 (2025-12-02)

### 🚀 Features

- admin rest api ([3c54247](https://github.com/typewoo/sdk/commit/3c54247))
- improve application password export process with temporary file handling ([d4b3524](https://github.com/typewoo/sdk/commit/d4b3524))
- add dotenv support for environment variable management in integration tests ([619f385](https://github.com/typewoo/sdk/commit/619f385))
- add dotenv configuration for environment variable management in customer checkout tests ([aa43408](https://github.com/typewoo/sdk/commit/aa43408))
- implement Batch and Cart Extensions APIs with integration tests ([57d20cb](https://github.com/typewoo/sdk/commit/57d20cb))
- api snapshots ([fa2e748](https://github.com/typewoo/sdk/commit/fa2e748))
- enhance authentication endpoint handling with support for glob patterns ([ecbcc77](https://github.com/typewoo/sdk/commit/ecbcc77))
- update types and add nestjs app ([0eee2dd](https://github.com/typewoo/sdk/commit/0eee2dd))

### 🩹 Fixes

- update passwords file path to use temporary directory ([6f53d84](https://github.com/typewoo/sdk/commit/6f53d84))
- update password extraction process and script execution order ([115adba](https://github.com/typewoo/sdk/commit/115adba))
- clean up WordPress environment teardown and improve logging during plugin tests ([387a7aa](https://github.com/typewoo/sdk/commit/387a7aa))
- update build job dependencies and improve password handling script ([8f63b73](https://github.com/typewoo/sdk/commit/8f63b73))
- enhance validation for invalid namespace in Cart Extensions API tests ([b863699](https://github.com/typewoo/sdk/commit/b863699))
- update controller routes to include 'wp-json' prefix ([dd6e002](https://github.com/typewoo/sdk/commit/dd6e002))
- add missing newline at end of package.json ([e475e36](https://github.com/typewoo/sdk/commit/e475e36))
- add missing newline at end of package.json ([689a54f](https://github.com/typewoo/sdk/commit/689a54f))
- tests ([5ff6dfd](https://github.com/typewoo/sdk/commit/5ff6dfd))
- update vitest command to use specific config for unit tests ([965f319](https://github.com/typewoo/sdk/commit/965f319))
- update package names from @typewoo/core to @typewoo/sdk ([e5a5ecf](https://github.com/typewoo/sdk/commit/e5a5ecf))
- update import path for CartResponseSchema to include file extension ([b4b381a](https://github.com/typewoo/sdk/commit/b4b381a))
- update workflows to use Node.js 24 and pnpm for dependency management ([da5e385](https://github.com/typewoo/sdk/commit/da5e385))
- update zod peer dependency version to allow minor updates ([d7767ce](https://github.com/typewoo/sdk/commit/d7767ce))
- remove outdated entries from changelogs and pnpm-lock.yaml ([e0ccddc](https://github.com/typewoo/sdk/commit/e0ccddc))

### ❤️ Thank You

- kmakris23

## 3.0.0-alpha.1 (2025-11-25)

### 🚀 Features

- admin rest api ([3c54247](https://github.com/typewoo/sdk/commit/3c54247))
- improve application password export process with temporary file handling ([d4b3524](https://github.com/typewoo/sdk/commit/d4b3524))
- add dotenv support for environment variable management in integration tests ([619f385](https://github.com/typewoo/sdk/commit/619f385))
- add dotenv configuration for environment variable management in customer checkout tests ([aa43408](https://github.com/typewoo/sdk/commit/aa43408))
- implement Batch and Cart Extensions APIs with integration tests ([57d20cb](https://github.com/typewoo/sdk/commit/57d20cb))
- api snapshots ([fa2e748](https://github.com/typewoo/sdk/commit/fa2e748))
- enhance authentication endpoint handling with support for glob patterns ([ecbcc77](https://github.com/typewoo/sdk/commit/ecbcc77))

### 🩹 Fixes

- update passwords file path to use temporary directory ([6f53d84](https://github.com/typewoo/sdk/commit/6f53d84))
- update password extraction process and script execution order ([115adba](https://github.com/typewoo/sdk/commit/115adba))
- clean up WordPress environment teardown and improve logging during plugin tests ([387a7aa](https://github.com/typewoo/sdk/commit/387a7aa))
- update build job dependencies and improve password handling script ([8f63b73](https://github.com/typewoo/sdk/commit/8f63b73))
- enhance validation for invalid namespace in Cart Extensions API tests ([b863699](https://github.com/typewoo/sdk/commit/b863699))
- update controller routes to include 'wp-json' prefix ([dd6e002](https://github.com/typewoo/sdk/commit/dd6e002))
- add missing newline at end of package.json ([e475e36](https://github.com/typewoo/sdk/commit/e475e36))
- add missing newline at end of package.json ([689a54f](https://github.com/typewoo/sdk/commit/689a54f))
- tests ([5ff6dfd](https://github.com/typewoo/sdk/commit/5ff6dfd))
- update vitest command to use specific config for unit tests ([965f319](https://github.com/typewoo/sdk/commit/965f319))
- update package names from @typewoo/core to @typewoo/sdk ([e5a5ecf](https://github.com/typewoo/sdk/commit/e5a5ecf))
- update import path for CartResponseSchema to include file extension ([b4b381a](https://github.com/typewoo/sdk/commit/b4b381a))
- update workflows to use Node.js 24 and pnpm for dependency management ([da5e385](https://github.com/typewoo/sdk/commit/da5e385))

### ❤️ Thank You

- kmakris23

## 2.1.0 (2025-09-16)

### 🚀 Features

- **plugin:** implement tracking functionality ([bf7e738](https://github.com/typewoo/sdk/commit/bf7e738))

### ❤️ Thank You

- Kostas Makris @kmakris23

## 2.0.1-alpha.0 (2025-09-15)

### 🚀 Features

- **typewoo:** add initialization flag to prevent double initialization in TypeWoo ([31cc4cd](https://github.com/typewoo/sdk/commit/31cc4cd))
- **tracking:** implement tracking functionality and enhance auto-login URL generation ([fa71133](https://github.com/typewoo/sdk/commit/fa71133))

### 🩹 Fixes

- **auth:** correct default value for trackingParams in getAutoLoginUrl method ([ac5641f](https://github.com/typewoo/sdk/commit/ac5641f))
- **package-plugin:** prioritize PowerShell over tar for Windows packaging ([6655d71](https://github.com/typewoo/sdk/commit/6655d71))
- **tracking:** sanitize request URI before checking against whitelisted paths ([6f70b45](https://github.com/typewoo/sdk/commit/6f70b45))

### ❤️ Thank You

- kmakris23

# 2.0.0 (2025-09-10)

### 🚀 Features

- create comprehensive README.md with detailed documentation ([d466536](https://github.com/typewoo/sdk/commit/d466536))
- Implement enhanced plugin architecture with event handler registration and include Angular example in CI builds ([fcf9ac3](https://github.com/typewoo/sdk/commit/fcf9ac3))
- enhance cart and order integration tests, improve error handling and assertions ([649641d](https://github.com/typewoo/sdk/commit/649641d))
- ⚠️ unify authentication in core package and introduce WordPress plugin ([74ede26](https://github.com/typewoo/sdk/commit/74ede26))

### 🩹 Fixes

- **deps:** update angular monorepo to ~20.2.0 ([823cb86](https://github.com/typewoo/sdk/commit/823cb86))

### ⚠️ Breaking Changes

- ⚠️ unify authentication in core package and introduce WordPress plugin ([74ede26](https://github.com/typewoo/sdk/commit/74ede26))

### ❤️ Thank You

- Copilot @Copilot
- kmakris23
- Kostas Makris @kmakris23

## 1.3.5-alpha.5 (2025-09-10)

### 🚀 Features

- **auth:** update getAutoLoginUrl parameter names for consistency ([60a6ad2](https://github.com/typewoo/sdk/commit/60a6ad2))
- **deps:** add React and ReactDOM with peer dependencies ([343adad](https://github.com/typewoo/sdk/commit/343adad))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.4 (2025-09-10)

### 🚀 Features

- **auth:** update getAutoLoginUrl to accept ott parameter for token generation ([c405c12](https://github.com/typewoo/sdk/commit/c405c12))
- **auth:** refactor getAutoLoginUrl tests to directly pass token and redirectUrl ([43beb57](https://github.com/typewoo/sdk/commit/43beb57))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.3 (2025-09-10)

### 🚀 Features

- **auth:** update getAutoLoginUrl to require redirectUrl and improve URL generation ([07af077](https://github.com/typewoo/sdk/commit/07af077))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.2 (2025-09-10)

### 🚀 Features

- **deps:** add React and ReactDOM with peer dependencies, remove dev flags from several packages ([ff699a9](https://github.com/typewoo/sdk/commit/ff699a9))
- **interceptors:** enhance refresh token handling with queue management and state reset functionality ([b296d14](https://github.com/typewoo/sdk/commit/b296d14))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.1 (2025-09-10)

### 🚀 Features

- **auth:** implement force authentication for specific endpoints ([f0a1740](https://github.com/typewoo/sdk/commit/f0a1740))
- **auth:** add test endpoint for force authentication and update deployment guide ([547bb91](https://github.com/typewoo/sdk/commit/547bb91))
- **auth:** improve token handling by ensuring async token and refresh token setting ([c7723c8](https://github.com/typewoo/sdk/commit/c7723c8))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.0 (2025-09-09)

This was a version bump only, there were no code changes.

## 1.3.4-alpha.0 (2025-09-08)

This was a version bump only, there were no code changes.

## 1.3.3-alpha.0 (2025-09-08)

### 🚀 Features

- **auth:** initialize authentication state based on provided token ([442c25f](https://github.com/typewoo/sdk/commit/442c25f))

### 🩹 Fixes

- **auth:** correct token retrieval logic in refresh token interceptor ([1a491d6](https://github.com/typewoo/sdk/commit/1a491d6))

### ❤️ Thank You

- kmakris23

## 1.3.2-alpha.0 (2025-09-08)

### 🚀 Features

- **auth:** add support for setting refresh token in token response ([91f13bf](https://github.com/typewoo/sdk/commit/91f13bf))

### ❤️ Thank You

- kmakris23

## 1.3.1-alpha.0 (2025-09-08)

### 🚀 Features

- **auth:** enhance authentication flow with token management and auto-login URL ([4ee683b](https://github.com/typewoo/sdk/commit/4ee683b))

### ❤️ Thank You

- kmakris23

## 1.3.0-alpha.0 (2025-09-08)

This was a version bump only, there were no code changes.

## 1.2.0-alpha.0 (2025-09-08)

### 🚀 Features

- create comprehensive README.md with detailed documentation ([d466536](https://github.com/typewoo/sdk/commit/d466536))
- Implement enhanced plugin architecture with event handler registration and include Angular example in CI builds ([fcf9ac3](https://github.com/typewoo/sdk/commit/fcf9ac3))
- enhance cart and order integration tests, improve error handling and assertions ([649641d](https://github.com/typewoo/sdk/commit/649641d))
- Implement TypeWoo JWT Authentication Plugin ([098a02a](https://github.com/typewoo/sdk/commit/098a02a))
- Refactor TypeWoo authentication plugin structure and update documentation for unified JWT support ([b39db7f](https://github.com/typewoo/sdk/commit/b39db7f))
- Add JWT support configuration and enhance user creation logic in setup script ([853a08b](https://github.com/typewoo/sdk/commit/853a08b))
- **auth:** implement token management and refresh functionality ([3511c31](https://github.com/typewoo/sdk/commit/3511c31))

### 🩹 Fixes

- Adjust table formatting in README for clarity on recommended approaches ([92ccab5](https://github.com/typewoo/sdk/commit/92ccab5))
- **deps:** update angular monorepo to ~20.2.0 ([823cb86](https://github.com/typewoo/sdk/commit/823cb86))
- **package:** add missing newline at end of file ([1d6fc0a](https://github.com/typewoo/sdk/commit/1d6fc0a))

### ❤️ Thank You

- Copilot @Copilot
- kmakris23

## 1.1.1 (2025-08-20)

### 🩹 Fixes

- update `simpleJwt` interface ([65a9c82](https://github.com/typewoo/sdk/commit/65a9c82))

### ❤️ Thank You

- Kostas Makris

## 1.1.0 (2025-08-20)

### 🚀 Features

- **simple-jwt-login:** add `redirectUrl` optional parameter to `getAutoLoginUrl` method ([5aa0a47](https://github.com/typewoo/sdk/commit/5aa0a47))

### ❤️ Thank You

- Kostas Makris

## 1.0.1 (2025-08-13)

### 🩹 Fixes

- **core:** always clear `nonce` and `cartToken` when auth change to `false` ([7dc98cd](https://github.com/typewoo/sdk/commit/7dc98cd))
- **core:** remove `simple-jwt-login` interceptor ([4104c9a](https://github.com/typewoo/sdk/commit/4104c9a))

### ❤️ Thank You

- Kostas Makris

# 1.0.0 (2025-08-12)

### 🚀 Features

- ⚠️ new event bus implementation ([53b0207](https://github.com/typewoo/sdk/commit/53b0207))
- **core:** add clear token function for `nonce` and `cartToken` ([da7f519](https://github.com/typewoo/sdk/commit/da7f519))
- **core:** add specific `simple-jwt-login` plugin interceptor ([7a5d061](https://github.com/typewoo/sdk/commit/7a5d061))
- ⚠️ **core:** move store api services under `store` property ([2978784](https://github.com/typewoo/sdk/commit/2978784))
- **simple-jwt-login:** automatically call `clearToken()` on token revoke success ([33c35c3](https://github.com/typewoo/sdk/commit/33c35c3))
- **simple-jwt-login:** add `fetchCartOnLogin` to automatically fetch cart after login and automatically remove `nonce` and `cartToken` on each logout ([fb6e964](https://github.com/typewoo/sdk/commit/fb6e964))
- **simple-jwt-login:** add `revokeTokenBeforeLogin` to automatically revoke token before each new login ([079128e](https://github.com/typewoo/sdk/commit/079128e))

### 🩹 Fixes

- **core:** use `simple-jwt-login` config for interceptor ([c57ed92](https://github.com/typewoo/sdk/commit/c57ed92))

### ⚠️ Breaking Changes

- New event bus has been implemented replacing the previous event emitter.
- **core:** Store API services have been moved under `store` property in `Typewoo`.

### ❤️ Thank You

- Kostas Makris

## 0.9.1 (2025-08-06)

### 🩹 Fixes

- **auth:** update getAutoLoginUrl to include route namespace in the endpoint ([af91110](https://github.com/typewoo/sdk/commit/af91110))

### ❤️ Thank You

- Kostas Makris

## 0.9.0 (2025-08-06)

### 🚀 Features

- **auth:** add getAutoLoginUrl method and autoLoginUrl config option ([05d549b](https://github.com/typewoo/sdk/commit/05d549b))

### ❤️ Thank You

- Kostas Makris

## 0.8.5 (2025-08-06)

### 🩹 Fixes

- **auth:** make body parameter optional in revokeToken method ([ddc0a83](https://github.com/typewoo/sdk/commit/ddc0a83))
- **axios:** ensure options are spread correctly in doRequest function ([26e6297](https://github.com/typewoo/sdk/commit/26e6297))

### ❤️ Thank You

- Kostas Makris

## 0.8.4 (2025-08-06)

### 🩹 Fixes

- **auth, user:** add options parameter to service methods for better request configuration ([224d42d](https://github.com/typewoo/sdk/commit/224d42d))

### ❤️ Thank You

- Kostas Makris

## 0.8.3 (2025-08-06)

### 🩹 Fixes

- **simple-jwt-login:** refresh-token: improve error handling by ensuring originalRequest is validated before processing 401 responses ([0299667](https://github.com/typewoo/sdk/commit/0299667))

### ❤️ Thank You

- Kostas Makris

## 0.8.2 (2025-08-06)

### 🩹 Fixes

- **refresh-token:** ensure config is passed to refreshTokenFailed for better error handling ([276e168](https://github.com/typewoo/sdk/commit/276e168))

### ❤️ Thank You

- Kostas Makris

## 0.8.1 (2025-08-06)

### 🩹 Fixes

- **simple-jwt:** add initial authentication state setup in plugin initialization ([b7bc0bb](https://github.com/typewoo/sdk/commit/b7bc0bb))

### ❤️ Thank You

- Kostas Makris

## 0.8.0 (2025-08-06)

### 🚀 Features

- **auth:** enhance authentication handling and state management ([ec53370](https://github.com/typewoo/sdk/commit/ec53370))

### ❤️ Thank You

- Kostas Makris

## 0.7.0 (2025-08-05)

### 🚀 Features

- **core:** enhance API services to support pagination in responses ([b6fbdad](https://github.com/typewoo/sdk/commit/b6fbdad))

### ❤️ Thank You

- Kostas Makris

## 0.6.1 (2025-08-05)

### 🩹 Fixes

- **core:** remove debug log from doRequest function ([001f0e8](https://github.com/typewoo/sdk/commit/001f0e8))

### ❤️ Thank You

- Kostas Makris

## 0.6.0 (2025-08-05)

### 🚀 Features

- conditional use interceptors ([ff12114](https://github.com/typewoo/sdk/commit/ff12114))
- **nx-cloud:** setup nx cloud workspace ([79caf69](https://github.com/typewoo/sdk/commit/79caf69))

### 🩹 Fixes

- **constants:** remove trailing slash from DEFAULT_ROUTE_NAMESPACE ([1fab969](https://github.com/typewoo/sdk/commit/1fab969))

### ❤️ Thank You

- Kostas Makris @kmakris23

## 0.5.0 (2025-08-04)

### 🚀 Features

- add simple-jwt-login plugin package ([1435f8c](https://github.com/typewoo/sdk/commit/1435f8c))

### 🩹 Fixes

- **core:** update `nonce` token regularly ([636a353](https://github.com/typewoo/sdk/commit/636a353))

### ❤️ Thank You

- Kostas Makris

## 0.4.3 (2025-08-03)

### 🩹 Fixes

- remove `development` export ([42a5acd](https://github.com/typewoo/sdk/commit/42a5acd))

### ❤️ Thank You

- Kostas Makris

## 0.4.2 (2025-08-03)

### 🩹 Fixes

- `vite.config.ts` preserveSymlinks ([35ec66a](https://github.com/typewoo/sdk/commit/35ec66a))

### ❤️ Thank You

- Kostas Makris

## 0.4.1 (2025-08-02)

### 🩹 Fixes

- release config ([8012816](https://github.com/typewoo/sdk/commit/8012816))
- **core:** add jwt utilities ([9cb9bea](https://github.com/typewoo/sdk/commit/9cb9bea))

### ❤️ Thank You

- Kostas Makris

## 0.4.1-0 (2025-08-02)

### 🚀 Features

- scaffold `jwt-authentication-for-wp-rest-api` package ([6d04e5b](https://github.com/typewoo/sdk/commit/6d04e5b))
- add JWT Authentication for WP REST API plugin ([6fc570a](https://github.com/typewoo/sdk/commit/6fc570a))

### 🩹 Fixes

- **core:** singleton axios instance, remove `baseUrl` usages and move plugin load into config ([75897e2](https://github.com/typewoo/sdk/commit/75897e2))
- **hippoo:** load plugin using `useHippoo` and use specific `HippoConfig` ([11bdd66](https://github.com/typewoo/sdk/commit/11bdd66))

### ❤️ Thank You

- Kostas Makris

## 0.4.0 (2025-07-31)

### 🚀 Features

- plugins and hippoo integration ([db49ba2](https://github.com/typewoo/sdk/commit/db49ba2))

### ❤️ Thank You

- Kostas Makris

## 0.3.0 (2025-07-31)

### 🚀 Features

- add `cartLoading` event ([5909a7e](https://github.com/typewoo/sdk/commit/5909a7e))

### ❤️ Thank You

- Kostas Makris

## 0.2.6 (2025-07-30)

### 🩹 Fixes

- pass correct axios instance options ([ae3f1ce](https://github.com/typewoo/sdk/commit/ae3f1ce))

### ❤️ Thank You

- Kostas Makris

## 0.2.5 (2025-07-30)

### 🩹 Fixes

- `cartChanged` value comparison ([a221a2a](https://github.com/typewoo/sdk/commit/a221a2a))

### ❤️ Thank You

- Kostas Makris

## 0.2.4 (2025-07-29)

### 🩹 Fixes

- use `await` ([0c1fafd](https://github.com/typewoo/sdk/commit/0c1fafd))

### ❤️ Thank You

- Kostas Makris

## 0.2.3 (2025-07-29)

### 🩹 Fixes

- query parameters ([9af8088](https://github.com/typewoo/sdk/commit/9af8088))

### ❤️ Thank You

- Kostas Makris

## 0.2.2 (2025-07-29)

### 🩹 Fixes

- update `nonce` and `cartToken` only when missing ([368f6dc](https://github.com/typewoo/sdk/commit/368f6dc))
- add missing request headers ([75d7e5f](https://github.com/typewoo/sdk/commit/75d7e5f))

### ❤️ Thank You

- Kostas Makris

## 0.2.1 (2025-07-29)

### 🩹 Fixes

- add missing `setToken` and `getToken` functions ([7d51f3b](https://github.com/typewoo/sdk/commit/7d51f3b))

### ❤️ Thank You

- Kostas Makris

## 0.2.0 (2025-07-29)

### 🚀 Features

- simpify requests, track `cart`, `nonce` and `cart` changes ([3276260](https://github.com/typewoo/sdk/commit/3276260))

### 🩹 Fixes

- add missing cart response properties ([239b1e9](https://github.com/typewoo/sdk/commit/239b1e9))

### ❤️ Thank You

- Kostas Makris

## 0.1.1 (2025-07-29)

### 🩹 Fixes

- bump version ([6089119](https://github.com/typewoo/sdk/commit/6089119))

### ❤️ Thank You

- Kostas Makris

## 0.1.0 (2025-07-29)

### 🚀 Features

- event emitters and api updates ([ed4f58d](https://github.com/typewoo/sdk/commit/ed4f58d))

### ❤️ Thank You

- Kostas Makris

## 0.0.16 (2025-07-27)

### 🩹 Fixes

- update `ApiResult` type ([2cec47a](https://github.com/typewoo/sdk/commit/2cec47a))

### ❤️ Thank You

- Kostas Makris

## 0.0.15 (2025-07-27)

### 🩹 Fixes

- convert service calls to `async` ([ed7f46c](https://github.com/typewoo/sdk/commit/ed7f46c))
- wrap responses around `ApiResult<T>` ([75b0afb](https://github.com/typewoo/sdk/commit/75b0afb))
- add missing request options ([e83da78](https://github.com/typewoo/sdk/commit/e83da78))

### ❤️ Thank You

- Kostas Makris

## 0.0.14 (2025-07-27)

### 🩹 Fixes

- `tsup` config ([38d1e34](https://github.com/typewoo/sdk/commit/38d1e34))

### ❤️ Thank You

- Kostas Makris

## 0.0.13 (2025-07-27)

This was a version bump only, there were no code changes.

## 0.0.12 (2025-07-27)

This was a version bump only, there were no code changes.

## 0.0.11 (2025-07-27)

This was a version bump only, there were no code changes.

## 0.0.10 (2025-07-27)

### 🩹 Fixes

- disable workflow and test ([44bf0eb](https://github.com/typewoo/sdk/commit/44bf0eb))

### ❤️ Thank You

- Kostas Makris

## 0.0.9 (2025-07-27)

### 🩹 Fixes

- update `tsup` config ([3c60ab2](https://github.com/typewoo/sdk/commit/3c60ab2))

### ❤️ Thank You

- Kostas Makris

## 0.0.8 (2025-07-26)

### 🚀 Features

- initial unit testing ([cef82b7](https://github.com/typewoo/sdk/commit/cef82b7))

### 🩹 Fixes

- eslint errors ([107ac3a](https://github.com/typewoo/sdk/commit/107ac3a))
- sdk initialization ([2277aa8](https://github.com/typewoo/sdk/commit/2277aa8))

### ❤️ Thank You

- Kostas Makris

## 0.0.7 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.6 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.5 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.4 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.3 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.2 (2025-07-25)

This was a version bump only, there were no code changes.
