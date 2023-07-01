# Common

This contains files that are shared between apps.

TODO Replace copying with an actually scalable solution.

Sharing is done by copying the contents of this directory to the various
locations. Copies live in

- `/apps/super-app/src/common`
- `/personal-calls/frontend/src/common`

These copies should not be modified directly - the 'main' one should be changed
and then copied over. We can consider `.gitignore`-ing the copies, but that
might lead to confusing 'works on my machine' issues during code review if a
developer accidentally changes a copy instead of the original.

Now, this is obviously terrible, but incredibly, the obvious alternatives don't
work!

- The easiest way to do this is to symlink `/apps/common` into the various
  directories we want, _but_ `create-react-app`'s Webpack configuration will
  only convert TypeScript files that are under `src/`, and it happens to resolve
  the symlinks into the real paths, so it refuses to transpile those.
  
  We _could_ try to fiddle with the Webpack config, but I frankly don't think
  it's worth ejecting (then we have to config everything ourselves), or using
  yet another library to try to patch the config (because when things break,
  it'll be confusing as heck to handle, and who knows how well these libraries
  work).
  
- The alternative is to make `apps/common` a local npm package that we can
  compile into JS and then install to the various apps, similar to the
  `personal-calls/shared` directory. Sounds simple, except that `apps/common`
  contains React code, and React Hooks requires that the `react` import resolves
  to the [same module](https://react.dev/warnings/invalid-hook-call-warning#duplicate-react).
  Building `apps/common` will use its own `react`, which doesn't match the app's
  `react`.
  
  It might be possible to dependency inject `react` into `apps/common`, but that
  sounds tedious rewrite.

A convenient side benefit, though, is that we don't have to change how
`personal-calls` builds, because it already has the files it needs.
