'use strict'

const { getHelp } = require('./../lib/util')

const command = 'checkout'

const description = 'Checkout a git branch fancily'

const args = [
  {
    name: 'limit',
    flag: 'l',
    type: 'number',
    default: 5,
    description: 'How many branches should present (max)?'
  },
  {
    name: 'include-remote',
    flag: 'i',
    type: 'boolean',
    default: false,
    description: 'Should remote brances be included?',
    pending: true
  },
  {
    name: 'remote-only',
    flag: 'r',
    type: 'boolean',
    default: false,
    description: 'Should only remote brances be listed?',
    pending: true
  }
]

const help = getHelp(command, args)

module.exports = { command, description, args, help }
