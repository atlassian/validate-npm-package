# validate-npm-package

> Validate a package.json file

```js
const validateNpmPackage = require('validate-npm-package');

let results = validateNpmPackage({
  name: 'foo',
  version: '1.0.0',
});
// {
//   validForNewPackages: false,
//   validForOldPackages: true,
//   warnings: ["..."],
//   errors: ["..."],
// }
```

There's also a CLI:

```sh
$ validate-npm-package
$ validate-npm-package path/to/pkg
$ validate-npm-package --quiet/-q
```
