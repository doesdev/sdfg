'use strict'

const { getHelp } = require('./../lib/util')

const command = 'interactive'

const description = 'Interactively select command to run'

const args = []

const help = getHelp(command, args)

module.exports = { command, description, args, help }
