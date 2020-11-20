'use strict'

const info = require('./../definitions/checkout')
const execa = require('execa')
const prompts = require('prompts')
const execOpts = { reject: false }

const exitWithErr = (err) => {
  console.error(err)
  process.exit(0)
}

const currentBranch = async () => {
  const raw = await execa('git', ['branch', '--show-current'], execOpts)
  if (raw.stderr) return exitWithErr(raw.stderr)
  return raw.stdout.trim()
}

const onCancel = (current) => () => {
  console.log(`Staying on ${current}`)
  process.exit()
}

const cmd = async (opts = {}) => {
  const { limit = 5, noMerged = false } = opts
  const current = await currentBranch()
  const branchCmd = ['branch', '--sort=-committerdate']

  if (noMerged) branchCmd.push('--no-merged')

  const { stdout, stderr } = await execa('git', branchCmd, execOpts)

  if (stderr) return exitWithErr(stderr)

  const filterCurrent = (b) => b !== current && b !== `* ${current}`

  const rawBranches = stdout.trim().split('\n')
  const allBranches = rawBranches.map((b) => b.trim()).filter((b) => b)
  const branches = allBranches.filter(filterCurrent).slice(0, limit)

  if (!branches.length) {
    return console.log(`${current} is the only active branch`)
  }

  if (current !== 'master' && !branches.includes('master')) {
    branches.unshift('master')
    if (branches.length > limit) branches.pop()
  }

  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Branch to checkout',
    choices: branches
  }, { onCancel: onCancel(current) })

  const branch = branches[response.value]

  if (branch === current) return onCancel()

  const checkout = await execa('git', ['checkout', branch], execOpts)

  if (checkout.stderr) return exitWithErr(checkout.stderr)

  console.log(checkout.stdout)

  const update = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to pull from origin?',
    initial: false
  })

  if (update.value !== true) return

  const pull = await execa('git', ['pull', 'origin', branch], execOpts)

  if (pull.stderr) return exitWithErr(pull.stderr)

  console.log(pull.stdout)
}

module.exports = { cmd, info }
