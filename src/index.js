#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer')
const globby = require('globby')
const nodeCipher = require('node-cipher')
const p = require('path')
const fs = require('fs')

const commands = ['encrypt', 'decrypt']
const excludedFiles = ['!.DS_Store']

/**
 * Prompt for a password
 *
 * @returns {promise} A promise
 */
function prompForPassword () {
  return inquirer.prompt([
    {
      type: 'password',
      message: 'Enter the password',
      name: 'password',
      validate (input) {
        return input.length > 0
      }
    }
  ])
}

/**
 * Get all files that match a given pattern
 *
 * @param {any} cb Callback called for each valid file
 * @param {string} [patterns] Regex pattern to match files

 * @returns {boolean} False if no path is found
 */
function getAllFiles (cb, patterns = ['**/*']) {
  patterns.push(...excludedFiles)

  // Get all paths in current directory
  const paths = globby.sync(patterns)

  if (paths.length === 0) {
    return false
  }

  paths.map(path => {
    // For each path, check if it is a file and if it exists
    if (fs.lstatSync(path).isFile() && fs.existsSync(path)) {
      return cb(path)
    }
  })
}

/**
 * Encrypt/decrypt cipher
 *
 * @param {Object} options Options
 * @param {string} [options.cmd] Command to execute (encrypt/decrypt)
 * @param {string} [options.algorithm] Algorithm used to create the cipher
 * @param {string} [options.digest] HMAC digest algorithm used to derive the key
 * @param {string} [options.extension] Extension appended to the files
 * @param {string} [options.folder] Folder used to encrypt/decrypt files
 * @param {string} [options.password] Password used to encrypt/decrypt files
 */
function cipher ({ cmd, algorithm, digest, extension, folder, password }) {
  const joinedPath = p.join(folder, '**/*')

  let patterns

  if (cmd === 'encrypt') {
    patterns = [joinedPath, `!${joinedPath}.${extension}`]
  } else if (cmd === 'decrypt') {
    patterns = [`${joinedPath}.${extension}`]
  }

  const result = getAllFiles(path => {
    nodeCipher[cmd]({
      input: path,
      output: cmd === 'encrypt' ? path + `.${extension}` : path.replace(`.${extension}`, ''),
      password,
      algorithm,
      digest
    }, err => {
      if (err) {
        console.error(err.message)
        return
      }

      // Remove old encrypted/decrypted file
      if (fs.existsSync(path)) {
        fs.unlinkSync(path)
      }

      console.log(`File '${path}' ${cmd}ed`)
    })
  }, patterns)

  if (result === false) {
    console.error(`No files to ${cmd}`)
  }
}

program
  .version('1.0.0')
  .usage(`<(e)ncrypt|(d)ecrypt> [options]`)

commands.map(cmd => {
  program
    .command(`${cmd}`)
    .description(`${cmd} files`)
    .alias(cmd.charAt(0))
    .option('-a, --algorithm <value>', 'algorithm used to create the cipher')
    .option('-d, --digest <value>', 'HMAC digest algorithm used to derive the key')
    .option('-e, --extension <value>', `extension appended to the ${cmd}ed files`)
    .option('-f, --folder <value>', `folder used to ${cmd} files`)
    .option('-p, --password <value>', `password used to ${cmd} files`)
    .action(({ algorithm = 'aes-256-ctr', digest = 'sha256', extension = 'encrypted', folder = './', password = null }) => {
      if (password) {
        cipher({ cmd, algorithm, digest, extension, folder, password })
      } else {
        prompForPassword()
          .then(({ password }) => cipher({ cmd, algorithm, digest, extension, folder, password }))
      }
    })
})

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
