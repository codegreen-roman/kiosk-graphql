import React, { FC, useReducer, useRef } from 'react'
import ContentEditable from 'react-contenteditable'
import { NextPageContext } from 'next'
import { keys, split, last, compose } from 'ramda'
import styled from 'styled-components'
import { ParsedUrlQuery } from 'querystring'
import { getAllContent, KeyValue } from '@utils/translationFilesReader'
import { useRouter } from 'next/router'

const getActualKey = compose(last, split('.'))

const KeyPrefix = styled.span`
  opacity: 0.3;
`
const Row = styled.div`
  margin: 0 auto;
  display: flex;
  width: 85%;
  justify-content: space-between;
  padding: 3px 0;
`
const Heading = styled.strong`
  flex: 1 1 400px;
  text-align: end;
  padding-right: 20px;
  font-weight: 800;
  font-family: monospace;
`

const AroundValue = styled.div`
  width: 100%;
`

const AroundDownloadButton = styled.a`
  display: flex;
  width: 100%;
  padding: 15px;
  justify-content: center;
  margin-bottom: 2rem;
`

interface TranslatePageProps {
  data: KeyValue
}

interface TranslationState {
  translations: KeyValue
}

export enum Types {
  updateValue,
}

export interface UpdateValueAction {
  type: Types.updateValue
  payload: { key: string; value: string }
}

export type TranslationsAction = UpdateValueAction

const initialState: TranslationState = {
  translations: {},
}

function reducer(state: TranslationState = initialState, action: TranslationsAction): TranslationState {
  switch (action.type) {
    case Types.updateValue:
      return { ...state, translations: { ...state.translations, [action.payload.key]: action.payload.value } }
    default:
      throw new Error()
  }
}

const TranslatePage: FC<TranslatePageProps> = ({ data = {} }) => {
  const [state, dispatch] = useReducer(reducer, { translations: data })
  const router = useRouter()
  const { query } = router

  const currentText = useRef('')

  const handleChange = (event): void => {
    const {
      currentTarget: {
        dataset: { keyid },
      },
      target: { value },
    } = event

    currentText.current = JSON.stringify({ key: keyid, value: value.trim() })
  }

  const handleBlur = (): void => {
    if (!currentText.current) return

    try {
      const { key, value } = JSON.parse(currentText.current)
      dispatch({ type: Types.updateValue, payload: { key, value: value.trim() } })
    } catch (e) {
      // console.log('parse error', e)
      // ignoring JSON parse
    } finally {
      currentText.current = ''
    }
  }

  const pasteAsPlainText = (event): void => {
    event.preventDefault()

    const text = event.clipboardData.getData('text/plain')
    document.execCommand('insertHTML', false, text.trim())
  }

  const disableNewlines = (event): void => {
    const keyCode = event.keyCode || event.which

    if (keyCode === 13) {
      event.returnValue = false
      if (event.preventDefault) event.preventDefault()
      event.target.blur()
    }
  }

  return (
    <div>
      <h3>Edit Translations for Language {query.lang}</h3>
      {keys(data).map((key: string) => {
        const actualKey = getActualKey(key)
        return (
          <Row key={key}>
            <Heading>
              <KeyPrefix>{key.replace(actualKey as string, '')}</KeyPrefix>
              {actualKey}
            </Heading>
            <AroundValue>
              <ContentEditable
                style={{ ...(state.translations[key] !== data[key] && { background: '#fa807247' }) }}
                onKeyPress={disableNewlines}
                onPaste={pasteAsPlainText}
                html={state.translations[key]}
                disabled={false}
                onChange={handleChange}
                onBlur={handleBlur}
                data-keyid={key}
                spellCheck
              />
            </AroundValue>
          </Row>
        )
      })}

      <AroundDownloadButton>
        <a
          href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(state.translations))}`}
          download={`translations.${query.lang}.json`}
        >
          Save all to json file
        </a>
      </AroundDownloadButton>
    </div>
  )
}

export default TranslatePage

export async function getServerSideProps(context: NextPageContext): Promise<{ props: TranslatePageProps }> {
  const { lang }: ParsedUrlQuery = context.query

  const pathName = `./i18n/locales/${lang}`
  const allValues = await getAllContent(pathName)

  return {
    props: {
      data: allValues,
    },
  }
}
