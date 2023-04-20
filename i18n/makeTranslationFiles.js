const lang = process.env.LANG || 'en'
const chalk = require('chalk')
const data = require(`./source/${lang}/translations.json`)
const { promises } = require('fs')
const path = require('path')
const { keys, compose, map, split, init, last, join, reduce, mergeAll } = require('ramda')

const getFilenameAndKey = (fullName) => {
  const slitted = split('.')(fullName)
  return {
    filename: compose(join('.'), init)(slitted),
    pureKey: last(slitted),
  }
}

const reducer = (acc, { filename, key, translationText }) => {
  const currentEntry = { [key]: translationText }

  return {
    ...acc,
    [filename]: [...(acc[filename] || []), currentEntry],
  }
}

const directory = `source/${lang}/generated`

const prepare = async () => {
  await promises.rmdir(path.join(__dirname, directory), { recursive: true })
  await promises.mkdir(path.join(__dirname, directory))
}

const app = () => {
  const dataMap = compose(
    reduce(reducer, {}),
    map((key) => ({
      sourceKey: key,
      filename: getFilenameAndKey(key).filename,
      key: getFilenameAndKey(key).pureKey,
      translationText: data[key],
    })),
    keys
  )(data)

  keys(dataMap).forEach(async (resultingFilename) => {
    try {
      await promises.writeFile(
        path.join(__dirname, directory, `${resultingFilename}.json`),
        JSON.stringify(mergeAll(dataMap[resultingFilename]), null, 2),
        { flag: 'w' }
      )

      console.log(chalk.blue.bold(path.join(__dirname, directory, `${resultingFilename}.json`)))
    } catch (e) {
      console.error(chalk.green.bgRed.bold(`cannot write file ${resultingFilename}.json`), e)
    }
  })
}

prepare().then(app).catch(console.error)
