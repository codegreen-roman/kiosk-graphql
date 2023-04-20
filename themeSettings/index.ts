import themeSettingsJson from './kihnuKiosk/theme-settings.json'
import themeBusinessRulesJson from './kihnuKiosk/theme-business-rules.json'

const themeSettings = themeSettingsJson as any
const themeBusinessRules = themeBusinessRulesJson as any

export * from './kihnuKiosk/settingsSelectors'
export * from './kihnuKiosk/rulesSelectors'
export { themeSettings, themeBusinessRules }
