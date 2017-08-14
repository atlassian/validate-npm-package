// @flow
'use strict';

const validateNpmPackage = require('./');

function run(pkg) {
  return validateNpmPackage(pkg);
}

function error(pkg, str) {
  expect(run(pkg).errors).toContain(str);
}

function warning(pkg, str) {
  expect(run(pkg).warnings).toContain(str);
}

function notError(pkg, str) {
  expect(run(pkg).errors).not.toContain(str);
}

function notWarning(pkg, str) {
  expect(run(pkg).warnings).not.toContain(str);
}

test('name', () => {
  error({}, 'name must be a string');
  error({ name: 42 }, 'name must be a string');
  error({ name: '%' }, 'name can only contain URL-friendly characters');
  notError({ name: 'hi' }, 'name must be a string');
});

test('version', () => {
  error({}, 'version must be a string');
  error({ version: 42 }, 'version must be a string');
  error({ version: '%' }, 'version must be a valid semver version');
  notError({ version: '2.0.0' }, 'version must be a string');
  notError({ version: '2.0.0' }, 'version must be a valid semver version');
});

test('license', () => {
  error({}, 'license must be a string');
  error({ license: 42 }, 'license must be a string');
  warning({ license: 'ERR' }, 'license should be a valid SPDX license expression (without "LicenseRef"), "UNLICENSED", or "SEE LICENSE IN <filename>"');
  notWarning({ version: 'MIT' }, 'license should be a valid SPDX license expression (without "LicenseRef"), "UNLICENSED", or "SEE LICENSE IN <filename>"');
});

test('description', () => {
  error({}, 'description must be a string');
  error({ description: false }, 'description must be a string');
  notError({ description: 'hi' }, 'description must be a string');
});

test('main', () => {
  error({}, 'main must be a string');
  error({ main: false }, 'main must be a string');
  notError({ main: 'index.js' }, 'main must be a string');
});

test('bin', () => {
  notError({}, 'bin must be a string or object of strings');
  error({ bin: false }, 'bin must be a string or object of strings');
  notError({ bin: 'index.js' }, 'bin must be a string or object of strings');
});

test('keywords', () => {
  warning({}, 'missing keywords');
  error({ keywords: false }, 'keywords must be an array of strings');
  notError({ keywords: ['hi'] }, 'keywords must be an array of strings');
});

test('bugs', () => {
  warning({}, 'missing bugs');
  error({ bugs: false }, 'bugs must be a string');
  notError({ bugs: 'repo/user' }, 'bugs must be a string');
});

test('homepage', () => {
  warning({}, 'missing homepage');
  error({ homepage: false }, 'homepage must be a string');
  notWarning({ homepage: 'repo/user' }, 'missing homepage');
  notError({ homepage: 'repo/user' }, 'homepage must be a string');
});

test('repository', () => {
  warning({}, 'missing repository');
  error({ repository: false }, 'repository must be string or object with a type and url');
  error({ repository: {} }, 'repository must be string or object with a type and url');
  error({ repository: { type: 'git' } }, 'repository must be string or object with a type and url');
  error({ repository: { url: 'https://github.com/repo/user' } }, 'repository must be string or object with a type and url');
  notWarning({ repository: 'repo/user' }, 'missing repository');
  notError({ repository: 'repo/user' }, 'repository must be string or object with a type and url');
  notWarning({ repository: { type: 'git', url: 'https://github.com/repo/user' } }, 'missing repository');
  notError({ repository: { type: 'git', url: 'https://github.com/repo/user' } }, 'repository must be string or object with a type and url');
});

test('files', () => {
  warning({}, 'missing files');
  error({ files: false }, 'files must be an array of strings');
  notError({ files: ['index.js'] }, 'files must be an array of strings');
});

test('directories', () => {
  error({ directories: false }, 'directories must be an object of strings');
  error({ directories: { test: false } }, 'directories must be an object of strings');
  notError({ directories: { test: 'test/' } }, 'directories must be an object of strings');
});

test('scripts', () => {
  error({ scripts: false }, 'scripts must be an object of strings');
  error({ scripts: { test: false } }, 'scripts must be an object of strings');
  notError({ scripts: { test: 'jest' } }, 'scripts must be an object of strings');
});

test('config', () => {
  error({ config: false }, 'config must be an object of strings');
  error({ config: { opt: false } }, 'config must be an object of strings');
  notError({ config: { opt: 'value' } }, 'config must be an object of strings');
});

test('engines', () => {
  error({ engines: false }, 'engines must be an object of strings');
  error({ engines: { node: false } }, 'engines must be an object of strings');
  notError({ engines: { node: '8' } }, 'engines must be an object of strings');
});

test('publishConfig', () => {
  error({ publishConfig: false }, 'publishConfig must be an object');
  notError({ publishConfig: { opt: false } }, 'publishConfig must be an object');
  notError({ publishConfig: { opt: 'value' } }, 'publishConfig must be an object');
});

test('os', () => {
  error({ os: false }, 'os must be an array of strings');
  error({ os: [false] }, 'os must be an array of strings');
  notError({ os: ['darwin'] }, 'os must be an array of strings');
});

test('cpu', () => {
  error({ cpu: false }, 'cpu must be an array of strings');
  error({ cpu: [false] }, 'cpu must be an array of strings');
  notError({ cpu: ['x64'] }, 'cpu must be an array of strings');
});

test('bundledDependencies', () => {
  error({ bundledDependencies: false }, 'bundledDependencies must be an array of strings');
  error({ bundledDependencies: [false] }, 'bundledDependencies must be an array of strings');
  notError({ bundledDependencies: ['pkg-1'] }, 'bundledDependencies must be an array of strings');
});

test('dependencies', () => {
  error({ dependencies: false }, 'dependencies must be an object of strings');
  error({ dependencies: { 'pkg-1': false } }, 'dependencies must be an object of strings');
  notError({ dependencies: { 'pkg-1': '1.0.0' } }, 'dependencies must be an object of strings');
});

test('devDependencies', () => {
  error({ devDependencies: false }, 'devDependencies must be an object of strings');
  error({ devDependencies: { 'pkg-1': false } }, 'devDependencies must be an object of strings');
  notError({ devDependencies: { 'pkg-1': '1.0.0' } }, 'devDependencies must be an object of strings');
});

test('optionalDependencies', () => {
  error({ peerDependencies: false }, 'peerDependencies must be an object of strings');
  error({ peerDependencies: { 'pkg-1': false } }, 'peerDependencies must be an object of strings');
  notError({ peerDependencies: { 'pkg-1': '1.0.0' } }, 'peerDependencies must be an object of strings');
});

test('optionalDependencies', () => {
  error({ optionalDependencies: false }, 'optionalDependencies must be an object of strings');
  error({ optionalDependencies: { 'pkg-1': false } }, 'optionalDependencies must be an object of strings');
  notError({ optionalDependencies: { 'pkg-1': '1.0.0' } }, 'optionalDependencies must be an object of strings');
});

test('author', () => {
  warning({}, 'missing author');
  error({ author: false }, 'author must be string or object with a name, email, and url');
  notError({ author: 'foo <email@foo.com>' }, 'author must be string or object with a name, email, and url');
  error({ author: {} }, 'author must be string or object with a name, email, and url');
  error({ author: { name: 'foo' } }, 'author must be string or object with a name, email, and url');
  error({ author: { name: 'foo', email: false } }, 'author must be string or object with a name, email, and url');
  error({ author: { name: false, email: 'email@foo.com' } }, 'author must be string or object with a name, email, and url');
  notError({ author: { name: 'foo', email: 'email@foo.com' } }, 'author must be string or object with a name, email, and url');
  error({ author: { name: 'foo', email: 'email@foo.com', url: false } }, 'author must be string or object with a name, email, and url');
  notError({ author: { name: 'foo', email: 'email@foo.com', url: 'https://website.com' } }, 'author must be string or object with a name, email, and url');
});

test('contributors', () => {
  error({ contributors: false }, 'contributors must be an array of strings or objects with a name, email, and url');
  notError({ contributors: ['foo <email@foo.com>'] }, 'contributors must be an array of strings or objects with a name, email, and url');
  error({ contributors: [{}] }, 'contributors must be an array of strings or objects with a name, email, and url');
  error({ contributors: [{ name: 'foo' }] }, 'contributors must be an array of strings or objects with a name, email, and url');
  error({ contributors: [{ name: 'foo', email: false }] }, 'contributors must be an array of strings or objects with a name, email, and url');
  error({ contributors: [{ name: false, email: 'email@foo.com' }] }, 'contributors must be an array of strings or objects with a name, email, and url');
  notError({ contributors: [{ name: 'foo', email: 'email@foo.com' }] }, 'contributors must be an array of strings or objects with a name, email, and url');
  error({ contributors: [{ name: 'foo', email: 'email@foo.com', url: false }] }, 'contributors must be an array of strings or objects with a name, email, and url');
  notError({ contributors: [{ name: 'foo', email: 'email@foo.com', url: 'https://website.com' }] }, 'contributors must be an array of strings or objects with a name, email, and url');
});
