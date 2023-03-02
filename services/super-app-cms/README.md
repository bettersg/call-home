# Super App CMS

[Strapi](https://docs.strapi.io)-powered content management!

## Development

### Smoke test

- Set the value of field "test" to true
- Navigate to roles > Public and grant unauthenticated users `find` permissions
  on Smoke-test.
  
TODO It's likely that we will have to repeat this authentication step for future
content types. See if there's a way to set this in code so that we don't have to
do this continuously.
