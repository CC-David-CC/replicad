# Owned original reference tests

These1 original test files belong to replicad because their imported source modules match this repository’s exact captured blobs. Current implementation files and assertions are unchanged. Import and proven fixture/resource URL locators are ported to this repository; no cross-repository private source imports or compatibility path shims are added.

Mechanical source-test baseline `d07ca26dac9637ff51dbe787bde5ff07eb6dca14`; merge `29ea47a32f320113c89728a36faadfa34eb5b61e`. Private phase44 preserves earlier paths, explicit copy boundaries and source-to-result commit/ref maps. The locator-normalized complete AST is unchanged, not just selected assertions.

Run `npm run test:reference`. This is Node unit/reference qualification of the retained domain modules, not browser/worker/kernel/renderer/storage/authentication/human-agent acceptance. Current app hosting/build and shared-operation integration gates remain separately open.

Captured baseline and current port: 1 pass, 0 fail, 0 cancelled, 0 skipped across 1 reported Node subtests. Top-level assertion-only files count as one reported Node subtest, not individual assertions.
