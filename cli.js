#! /usr/bin/env node
'use strict'

const rawArgs = process.argv.slice(2)
const commands = require('./index')
const cmdMap = (c) => `${c.info.command} - ${c.info.description}`

const cmd = async () => {
  console.log(`Commands:\n${Object.values(commands).map(cmdMap).join('\n')}\n`)
}

const command = commands[rawArgs[0]] || { cmd }

const main = async () => {
  if (rawArgs.includes('--help') || rawArgs.includes('-h')) {
    return console.log(command.info.help)
  }

  command.cmd()
}

main().catch(console.error)
