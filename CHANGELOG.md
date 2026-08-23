# insert-module-globals Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [7.2.7](https://github.com/unabandoned/insert-module-globals/compare/insert-module-globals-v7.2.6...insert-module-globals-v7.2.7) (2026-08-23)


### Dependencies & maintenance

* **deps:** update commitlint monorepo to v21.2.2 ([#19](https://github.com/unabandoned/insert-module-globals/issues/19)) ([31aabdc](https://github.com/unabandoned/insert-module-globals/commit/31aabdc800e229484e436fb27e38cfef041c7999))
* **deps:** update dependency module-deps to v6.2.9 ([#22](https://github.com/unabandoned/insert-module-globals/issues/22)) ([8159013](https://github.com/unabandoned/insert-module-globals/commit/8159013e3d9d7a79849f1145bc750b807e15f348))
* **deps:** update unabandoned/.github action to v1.0.1 ([#21](https://github.com/unabandoned/insert-module-globals/issues/21)) ([ebc671b](https://github.com/unabandoned/insert-module-globals/commit/ebc671b500d3d93528c96d09b5cacce5d77c52b2))
* **deps:** update unabandoned/.github action to v1.0.2 ([#23](https://github.com/unabandoned/insert-module-globals/issues/23)) ([1f60d4b](https://github.com/unabandoned/insert-module-globals/commit/1f60d4bc3f3877ccebbacba23096d02c336f04cf))

## [7.2.6](https://github.com/unabandoned/insert-module-globals/compare/insert-module-globals-v7.2.5...insert-module-globals-v7.2.6) (2026-08-15)


### Dependencies & maintenance

* **deps:** update dependency browser-pack to v6.1.4 ([#16](https://github.com/unabandoned/insert-module-globals/issues/16)) ([25d6167](https://github.com/unabandoned/insert-module-globals/commit/25d6167308f9688b9c09b7e10a5046da53f9b0a3))
* **deps:** update dependency module-deps to v6.2.8 ([#17](https://github.com/unabandoned/insert-module-globals/issues/17)) ([4423bb1](https://github.com/unabandoned/insert-module-globals/commit/4423bb187151c988246d3b95168277c8cc1e718c))
* pin reusable workflows to the @unabandoned/.github v1.0.0 release ([#14](https://github.com/unabandoned/insert-module-globals/issues/14)) ([e543e20](https://github.com/unabandoned/insert-module-globals/commit/e543e202353de119f6182fdababde1741d482e43))

## [7.2.5](https://github.com/unabandoned/insert-module-globals/compare/insert-module-globals-v7.2.4...insert-module-globals-v7.2.5) (2026-08-14)


### Bug Fixes

* repoint JSONStream at its [@unabandoned](https://github.com/unabandoned) fork ([#12](https://github.com/unabandoned/insert-module-globals/issues/12)) ([1501209](https://github.com/unabandoned/insert-module-globals/commit/150120929039255e079ee35e73288f40c970d8b7))


### Dependencies & maintenance

* add .unabandoned.yml dashboard metadata ([#8](https://github.com/unabandoned/insert-module-globals/issues/8)) ([9ad8f77](https://github.com/unabandoned/insert-module-globals/commit/9ad8f77802c151fecfddd22a4b3251f03c0730cb))
* **deps:** update unabandoned/.github digest to 88ce617 ([#9](https://github.com/unabandoned/insert-module-globals/issues/9)) ([29d63ba](https://github.com/unabandoned/insert-module-globals/commit/29d63ba375f54a2e8924fc278debecc8c5179b3b))
* **deps:** update unabandoned/.github digest to d493a18 ([#11](https://github.com/unabandoned/insert-module-globals/issues/11)) ([2f1b4ff](https://github.com/unabandoned/insert-module-globals/commit/2f1b4ff45dbd6fb54b493b92d2b2ea8da9e7f8a1))
* pin reusable workflows to the @unabandoned/.github v1.0.0 release ([#15](https://github.com/unabandoned/insert-module-globals/issues/15)) ([927760a](https://github.com/unabandoned/insert-module-globals/commit/927760ab11575caf39834f5794390931a17d7aca))

## [7.2.4](https://github.com/unabandoned/insert-module-globals/compare/insert-module-globals-v7.2.3...insert-module-globals-v7.2.4) (2026-08-14)


### Dependencies & maintenance

* **deps:** pin dependencies ([#6](https://github.com/unabandoned/insert-module-globals/issues/6)) ([44a17bd](https://github.com/unabandoned/insert-module-globals/commit/44a17bd73748db981e6f60d0d26aadd03455230d))

## [7.2.3](https://github.com/unabandoned/insert-module-globals/compare/insert-module-globals-v7.2.2...insert-module-globals-v7.2.3) (2026-08-14)


### Bug Fixes

* drop abandoned runtime deps via builtins, vendored shims, and fork aliases ([#4](https://github.com/unabandoned/insert-module-globals/issues/4)) ([2b5c957](https://github.com/unabandoned/insert-module-globals/commit/2b5c957156062282691e61fccaf2b36df6549f46))

## [7.2.2](https://github.com/unabandoned/insert-module-globals/compare/insert-module-globals-v7.2.1...insert-module-globals-v7.2.2) (2026-08-14)


### Dependencies & maintenance

* onboard insert-module-globals into the unabandoned program ([#1](https://github.com/unabandoned/insert-module-globals/issues/1)) ([6f19de5](https://github.com/unabandoned/insert-module-globals/commit/6f19de5828d6a8b5db4cd4a6ee3f229af4a53bd4))

## 7.2.1
* Fix incorrect output when source contains a top-level `const` declaration with the same name as an inserted global. ([d86999f](https://github.com/browserify/insert-module-globals/commit/d86999f0180e09dd272666f5aff8db04183b3ea2))
