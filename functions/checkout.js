'use strict'

const info = require('./../definitions/checkout')
const execa = require('execa')
const prompts = require('prompts')
const branchCmd = ['branch', '--sort=-committerdate', '--no-merged']

const currentBranch = async () => {
  const raw = await execa('git', ['branch', '--show-current'])
  return raw.stdout.trim()
}

const onCancel = (current) => () => {
  console.log(`Staying on ${current}`)
  process.exit()
}

const cmd = async (limit = 5) => {
  const current = await currentBranch()
  const rawBranches = (await execa('git', branchCmd)).stdout.trim().split('\n')
  const allBranches = rawBranches.filter((b) => b).map((b) => b.trim())
  const branches = allBranches.slice(0, limit)

  if (!branches.length) {
    return console.log(`${current} is the only active branch`)
  }

  if (current !== 'master' && !branches.includes('master')) {
    branches.unshift('master')
    branches.pop()
  }

  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Branch to checkout',
    choices: branches
  }, { onCancel: onCancel(current) })

  const branch = branches[response.value]

  if (branch === current) return onCancel()

  const checkoutCmd = execa('git', ['checkout', branch])
  checkoutCmd.stdout.pipe(process.stdout)
  checkoutCmd.stderr.pipe(process.stderr)
  await checkoutCmd

  const update = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to pull from origin?',
    initial: false
  })

  if (update.value !== true) return

  const pull = execa('git', ['pull', 'origin', branch])
  pull.stdout.pipe(process.stdout)
  pull.stderr.pipe(process.stderr)
}

module.exports = { cmd, info }
