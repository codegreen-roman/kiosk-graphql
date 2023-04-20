import themeNames from '../const/themeNames'

const themeFromEnv = process.env.NEXT_PUBLIC_THEME

if (themeFromEnv && !themeNames[themeFromEnv]) {
  throw new Error('Theme specified in env is not supported!')
}

export const currentThemeName: string = themeFromEnv ?? themeNames.default

export function chooseThemeComponent(themedComponents): any {
  return themedComponents[currentThemeName] ?? themedComponents[themeNames.default]
}
