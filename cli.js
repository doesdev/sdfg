#! /usr/bin/env node
'use strict'

const rawArgs = process.argv.slice(2)
const commands = require('./index')
const cmdMap = (c) => `${c.info.command} - ${c.info.description}`

const cmdList = Object.values(commands).map(cmdMap).join('\n')
const printCmds = `Commands:\n\n${cmdList}\n`
const cmd = async () => console.log(printCmds)
const command = commands[rawArgs[0]] || { cmd, info: { help: printCmds } }

const main = async () => {
  if (rawArgs.includes('--help') || rawArgs.includes('-h')) {
    return console.log(command.info.help)
  }

  command.cmd()
}

main().catch(console.error)
