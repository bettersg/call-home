# Common

TODO TODO TODO TODO TODO TODO TODO TODO
Refactor this out so that it can _actually_ be shared.
TODO TODO TODO TODO TODO TODO TODO TODO

This contains files that _should_ be shared between apps, but we just haven't
for whatever reasons, e.g.:

- Different versions of Material UI (v5.0.0 was introduced between
  personal-calls and super-app) break how the modules are used and imported
- Different versions of React and c-r-a (react@18.0.0) affect typechecking
- This reduces the risk of accidental breakage of personal-calls

## Development

These files can't be shared as-is, so modifications must be made to all versions
in tandem.

Copies of this directory live in:

- `/apps/super-app/src/common`: Material UI v5, React 18
- `/personal-calls/frontend/src/common`: Material UI v4, React 16
