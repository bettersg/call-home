# Super App CMS

[Strapi](https://docs.strapi.io)-powered content management!

## Development

### Smoke test

- Set the value of field "test" to true
- Navigate to roles > Public and grant unauthenticated users `find` permissions
  on Smoke-test.
  
### Internationalization (i18n)

- Navigate to Settings > Internationalization and add the Bengali (Bangladesh)
  (bn-BD) locale.
- Navigate to Content-Type Builder > Smoke-test. Edit the content type and in
  the modal menu, click 'Enable localization for this Content-Type'.
- Navigate to Content Manager > smoke-test. On the rght hand side, switch
  Locales to bn-BD and set the value of field "test" to true.

TODO It's likely that we will have to repeat this authentication step for future
content types. See if there's a way to set this in code so that we don't have to
do this continuously.
