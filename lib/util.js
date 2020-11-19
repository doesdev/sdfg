'use strict'

const filterPending = ({ pending }) => !pending

const mapPositionalArg = ({ name, type }) => `[${name}:${type}]`

const argDefinition = ({ name, flag, type, description }) => `
  --${name} (-${flag}) [${type}]: ${description}`

const getHelp = (command, args) => `
sdfg ${command} ${args.filter(filterPending).map(mapPositionalArg).join(' ')}
${args.filter(filterPending).map(argDefinition).join('')}

  Options can be passed positionally as in top command or as flags
`

module.exports = {
  filterPending,
  mapPositionalArg,
  argDefinition,
  getHelp
}
