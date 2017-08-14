// @flow
'use strict';

const semver = require('semver');
const validateNpmPackageName = require('validate-npm-package-name');
const validateNpmPackageLicense = require('validate-npm-package-license');

function isArrayOfStrings(value) {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isUndefined(value) {
  return typeof value === 'undefined';
}

function isString(value) {
  return typeof value === 'string';
}

function isObjectOfStrings(value) {
  return isObject(value) && Object.keys(value).every(key => typeof value[key] === 'string');
}

function isUndefinedOrString(value) {
  return isUndefined(value) || isString(value);
}

function warn(msg) {
  return { warnings: [msg] };
}

const validators = {};

validators.name = value => {
  if (!isString(value)) return 'name must be a string';
  return validateNpmPackageName(value);
};

validators.version = value => {
  if (!isString(value)) return 'version must be a string';
  if (!semver.valid(value)) return 'version must be a valid semver version';
  return true;
}

validators.license = value => {
  if (!isString(value)) return 'license must be a string';
  return validateNpmPackageLicense(value);
};

validators.description = value => {
  if (!isString(value)) return 'description must be a string';
  return true;
};

validators.main = value => {
  if (!isString(value)) return 'main must be a string';
  return true;
};

validators.bin = value => {
  if (isUndefined(value)) return true;
  if (isObjectOfStrings(value)) return true;
  if (!isString(value)) return 'bin must be a string or object of strings';
  return true;
};

validators.keywords = value => {
  if (isUndefined(value)) return warn('missing keywords');
  if (!isArrayOfStrings(value)) return 'keywords must be an array of strings';
  return true;
};

validators.bugs = value => {
  if (isUndefined(value)) return warn('missing bugs');
  if (!isString(value)) return 'bugs must be a string';
  return true;
};

validators.homepage = value => {
  if (isUndefined(value)) return warn('missing homepage');
  if (!isString(value)) return 'homepage must be a string';
  return true;
};

validators.repository = value => {
  if (isUndefined(value)) return warn('missing repository');
  if (isString(value)) return true;
  if (isObject(value) && isString(value.type) && isString(value.url)) return true;
  return 'repository must be string or object with a type and url';
};

validators.files = value => {
  if (isUndefined(value)) return warn('missing files');
  if (!isArrayOfStrings(value)) return 'files must be an array of strings';
  return true;
};

validators.man = value => {
  if (isUndefined(value)) return true;
  if (isArrayOfStrings(value)) return true;
  if (!isString(value)) return 'man must be a string or an array of strings';
};

validators.directories = value => {
  if (isUndefined(value)) return true;
  if (!isObjectOfStrings(value)) return 'directories must be an object of strings';
  return true;
};

validators.scripts = value => {
  if (isUndefined(value)) return true;
  if (!isObjectOfStrings(value)) return 'scripts must be an object of strings';
  return true;
};

validators.config = value => {
  if (isUndefined(value)) return true;
  if (!isObjectOfStrings(value)) return 'config must be an object of strings';
  return true;
};

validators.engines = value => {
  if (isUndefined(value)) return true;
  if (!isObjectOfStrings(value)) return 'engines must be an object of strings';
  return true;
};

validators.publishConfig = value => {
  if (isUndefined(value)) return true;
  if (!isObject(value)) return 'publishConfig must be an object';
  return true;
};

validators.os = value => {
  if (isUndefined(value)) return true;
  if (!isArrayOfStrings(value)) return 'os must be an array of strings';
  return true;
};

validators.cpu = value => {
  if (isUndefined(value)) return true;
  if (!isArrayOfStrings(value)) return 'cpu must be an array of strings';
  return true;
};

validators.bundledDependencies = value => {
  if (isUndefined(value)) return true;
  if (!isArrayOfStrings(value)) return 'bundledDependencies must be an array of strings';
  return true;
};

function createDependenciesValidator(name) {
  return value => {
    if (isUndefined(value)) return true;
    if (!isObjectOfStrings(value)) return `${name} must be an object of strings`;
    return true;
  };
}

validators.dependencies = createDependenciesValidator('dependencies');
validators.devDependencies = createDependenciesValidator('devDependencies');
validators.peerDependencies = createDependenciesValidator('peerDependencies');
validators.optionalDependencies = createDependenciesValidator('optionalDependencies');

function isAuthor(value) {
  if (isString(value)) return true;
  if (!isObject(value)) return false;
  if (!isString(value.name)) return false;
  if (!isString(value.email)) return false;
  if (!isUndefinedOrString(value.url)) return false;
  return true;
}

validators.author = value => {
  if (isUndefined(value)) return warn('missing author');
  if (!isAuthor(value)) return 'author must be string or object with a name, email, and url';
  return true;
};

validators.contributors = value => {
  if (isUndefined(value)) return true;
  if (Array.isArray(value) && value.every(isAuthor)) return true;
  return 'contributors must be an array of strings or objects with a name, email, and url';
};

function mergeValidation(results, validation) {
  if (validation === true) {
    validation = {
      validForNewPackages: true,
      validForOldPackages: true,
    };
  }

  if (isString(validation)) {
    validation = {
      validForNewPackages: false,
      validForOldPackages: false,
      errors: [validation],
    };
  }

  if (validation.validForNewPackages === false) {
    results.validForNewPackages = false;
  }

  if (validation.validForOldPackages === false) {
    results.validForOldPackages = false;
  }

  if (validation.warnings) {
    results.warnings = results.warnings.concat(validation.warnings);
  }

  if (validation.errors) {
    results.errors = results.errors.concat(validation.errors);
  }

  return results;
}

module.exports = function isValidPkg(pkg /*: Object */) {
  return Object.keys(validators).map(key => {
    return validators[key](pkg[key])
  }).reduce(mergeValidation, {
    validForNewPackages: true,
    validForOldPackages: true,
    warnings: [],
    errors: [],
  });
};
