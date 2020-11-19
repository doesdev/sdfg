'use strict'

const { filterPending } = require('./lib/util')
const checkout = require('./functions/checkout')
const interactive = require('./functions/interactive')

const toExport = Object.fromEntries([
  checkout,
  interactive
].filter(filterPending).map((c) => [c.info.command, c]))

module.exports = toExport
