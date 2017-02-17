# quark-crypto

[![build status][travis-image]][travis-url]
[![stability][stability-image]][stability-url]
[![npm version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]
[![semantic-release][semantic-release-image]][semantic-release-url]

Simple **CLI** tool to **encrypt/decrypt** multiple files.

## Installation

[![NPM](https://nodei.co/npm/quark-crypto.png)](https://www.npmjs.com/package/quark-crypto)

```sh
npm install -g quark-crypto
```

It will install `quark-crypto` package globally, so that you can use `qcrypto` binary everywhere.

## Usage

By default, it will encrypt/decrypt all files in the current directory using `aes-256-ctr` algorithm and 'sha256' digest.
It will append `.encrypted` extension to encrypted files and remove it after decryption.

```sh
$ qcrypto <(e)ncrypt|(d)ecrypt> [options]
```

## Commands

| Command   | Alias | Description                                |
| --------- | ----- | ------------------------------------------ |
| `encrypt` | `e`   | Encrypt all files in the current directory |
| `decrypt` | `d`   | Decrypt all files in the current directory |

## Options

| Flag          | Alias | Type     | Description                                                                                                                              | Default       |
| ------------- | ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `--algorithm` | `-a`  | `string` | Algorithm used to create the cipher                                                                                                      | `aes-256-ctr` |
| `--digest`    | `-d`  | `string` | HMAC digest algorithm used to derive the key                                                                                             | `sha256`      |
| `--extension` | `-e`  | `string` | Extension appended to the encrypted/decrypted files                                                                                      | `encrypted`   |
| `--folder`    | `-f`  | `string` | Folder used to encrypt/decrypt files                                                                                                     | `./`          |
| `--password`  | `-p`  | `string` | Password used to derive the encryption key. **Do not use this option**, it will prompt you to enter the password (see `examples` below). | `null`        |

## Examples

### Encrypt

```sh
$ qcrypto encrypt

? Enter the password *****
File 'example' encrypted
```

### Decrypt

```sh
$ qcrypto decrypt

? Enter the password *****
File 'example.encrypted' decrypted
```

### Algorithm

```sh
$ qcrypto encrypt --algorithm cast

? Enter the password *****
File 'example' encrypted
```

### Digest

```sh
$ qcrypto encrypt --digest sha512

? Enter the password *****
File 'example' encrypted
```

### Extension

```sh
$ qcrypto decrypt --extension custom

? Enter the password *****
File 'example.custom' decrypted
```

### Path

```sh
$ qcrypto encrypt --path ./my/custom/path

? Enter the password *****
File 'my/custom/path/example' encrypted
```

## Build

To build the sources with `babel` in `./lib` directory :

```sh
npm run build
```

## License

MIT [License](LICENSE.md) © [Patrick Heng](http://hengpatrick.fr/) [Fabien Motte](http://fabienmotte.com/) 

[travis-image]: https://img.shields.io/travis/fm-ph/quark-crypto/master.svg?style=flat-square
[travis-url]: http://travis-ci.org/fm-ph/quark-crypto
[stability-image]: https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square
[stability-url]: https://nodejs.org/api/documentation.html#documentation_stability_index
[npm-image]: https://img.shields.io/npm/v/quark-crypto.svg?style=flat-square
[npm-url]: https://npmjs.org/package/quark-crypto
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
