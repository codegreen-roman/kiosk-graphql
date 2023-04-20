import { promises } from 'fs'
import path from 'path'
import { compose, filter, mergeAll, keys, reduce } from 'ramda'

export type KeyValue = {
  [key: string]: string
}

const removeNonSenseAndMerge: (objs: KeyValue[]) => object = compose(mergeAll, filter(Boolean))

export const getAllContent = async (pathName: string): Promise<KeyValue> => {
  const files = await promises.readdir(path.join(pathName))

  const objects = files.map(async (name) => {
    try {
      if (!name.endsWith('.json')) throw Error(`not a json file [${name}], sorry`)
      const content = await promises.readFile(`${pathName}/${name}`, 'utf-8')
      const rawMap = JSON.parse(content)

      const prefix = name.replace('.json', '')

      return reduce((acc: KeyValue, val: string) => {
        return {
          ...acc,
          [`${prefix}.${val}`]: rawMap[val],
        }
      }, {} as KeyValue)(keys(rawMap) as readonly string[])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e.toString())
    }
  })

  const allContents = await Promise.all(objects)

  return removeNonSenseAndMerge(allContents) as KeyValue
}
