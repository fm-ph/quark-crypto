import test from 'ava'
import exec from 'executive'
import fs from 'fs-extra'
import randomString from 'random-string'

import pkg from '../package.json'

import { createTmpFile } from './utils'

const bin = pkg.bin.qcrypto

const tmpFolder = './test/.tmp'
const password = randomString()

test.before('clear temporary folder and ensure it exists', t => {
  fs.ensureDirSync(tmpFolder)
  fs.emptyDirSync(tmpFolder)
})

test.beforeEach('create temporary encrypted file', t => {
  t.context.encrypted = {}
  t.context.encrypted.file = createTmpFile({ dir: tmpFolder })
})

test.beforeEach('generate and write random content', t => {
  t.context.encrypted.content = randomString({ length: 32 })
  fs.writeFileSync(t.context.encrypted.file.name, t.context.encrypted.content)
})

test.beforeEach('encrypt file', t => {
  return exec.quiet(`${bin} encrypt --folder ${tmpFolder} --password ${password}`)
})

test.beforeEach('create temporary decrypted file', t => {
  t.context.decrypted = {}
  t.context.decrypted.file = createTmpFile({ dir: tmpFolder })
})

test.beforeEach('generate and write random content', t => {
  t.context.decrypted.content = randomString({ length: 32 })
  fs.writeFileSync(t.context.decrypted.file.name, t.context.decrypted.content)
})

test.afterEach('clear temporary folder', t => {
  fs.emptyDirSync(tmpFolder)
})

test.after.always('remove temporary folder', t => {
  fs.removeSync(tmpFolder)
})

test('execute --help', t => {
  return exec.quiet(`${bin} --help`).then(({ stdout }) => {
    t.true(typeof stdout === 'string')
    t.true(stdout.length > 0)
    t.true(stdout.includes('Usage'))
  })
})

test('execute -h', t => {
  return exec.quiet(`${bin} -h`).then(({ stdout }) => {
    t.true(typeof stdout === 'string')
    t.true(stdout.length > 0)
    t.true(stdout.includes('Usage'))
  })
})

test('execute --version', t => {
  return exec.quiet(`${bin} --version`).then(({ stdout }) => {
    t.true(typeof stdout === 'string')
    t.true(stdout.length >= 5)
  })
})

test('execute -V', t => {
  return exec.quiet(`${bin} -V`).then(({ stdout }) => {
    t.true(typeof stdout === 'string')
    t.true(stdout.length >= 5)
  })
})

test('execute with no arguments', t => {
  return exec.quiet(`${bin}`).then(({ stdout }) => {
    t.true(typeof stdout === 'string')
    t.true(stdout.length > 0)
    t.true(stdout.includes('Usage'))
  })
})

test.serial('execute \'encrypt\' command', t => {
  return exec.quiet(`${bin} encrypt --folder ${tmpFolder} --password ${password}`).then(({ stdout, stderr }) => {
    t.is(stderr, '')
    t.true(typeof stdout === 'string')
    t.is(stdout, `File '${t.context.decrypted.file.name}' encrypted\n`)
  })
})

test.serial('execute \'decrypt\' command', t => {
  return exec.quiet(`${bin} decrypt --folder ${tmpFolder} --password ${password}`).then(({ stdout, stderr }) => {
    const decryptedContent = fs.readFileSync(t.context.encrypted.file.name.replace('.encrypted', ''), 'utf8')

    t.is(stderr, '')
    t.true(typeof stdout === 'string')
    t.is(decryptedContent, t.context.encrypted.content)
    t.is(stdout, `File '${t.context.encrypted.file.name}.encrypted' decrypted\n`)
  })
})
