import winston from 'winston'
import R from 'ramda'

const { timestamp, combine, json: logType, printf, colorize } = winston.format
// const timestampOpts = { format: 'YYYY-MM-DD HH:mm:ss' } // old timestamp options, not used

const consoleFormat = combine(
  colorize({
    message: true,
    level: true,
    colors: { info: 'green', error: 'red', debug: 'blue' },
  }),
  printf(({ level, message, ...rest }) => {
    const tStamp = new Date().toLocaleString()
    const body = R.isEmpty(rest) ? '' : `\n${JSON.stringify(rest)}`
    return `${tStamp} [${level}] ${message}${body}`
  })
)

const format = combine(timestamp(), logType())

const consoleLevel = process.env.LOG_LEVEL || 'info'
const formatForTheEnv = process.env.NODE_ENV === 'development' ? consoleFormat : format

const transports = [
  // new winston.transports.File({
  //   filename: 'error.log',
  //   level: 'error',
  //   format,
  // }),
  // new winston.transports.File({
  //   format,
  //   level: 'silly',
  //   filename: 'all-events.log',
  // }),
  new winston.transports.Console({
    format: formatForTheEnv,
    level: consoleLevel,
  }),
]

winston.configure({
  transports,
})
