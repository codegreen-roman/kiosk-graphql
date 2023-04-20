import { themeSettings } from '../index'

interface Fonts {
  primary: string
  secondary: string
}
export const getFonts = (): Fonts => ({
  primary: themeSettings.fonts.primary,
  secondary: themeSettings.fonts.secondary,
})

interface TextColors {
  default: string
  defaultInverted: string
  disabled: string
  heading: string
  info: string
  annotation: string
  accent: string
  nameAccent: string
  terms: string
  warning: string
  promotionAccepted: string
}
export const getTextColors = (): TextColors => ({
  default: themeSettings.colors.text.default,
  defaultInverted: themeSettings.colors.text.defaultInverted,
  disabled: themeSettings.colors.text.disabled,
  heading: themeSettings.colors.text.heading,
  info: themeSettings.colors.text.info,
  annotation: themeSettings.colors.text.annotation,
  accent: themeSettings.colors.text.accent,
  nameAccent: themeSettings.colors.text.nameAccent,
  terms: themeSettings.colors.text.terms,
  warning: themeSettings.colors.text.warning,
  promotionAccepted: themeSettings.colors.text.promotionAccepted,
})

interface ContentDividerColors {
  contentDivider: string
}
export const getContentDividerColors = (): ContentDividerColors => ({
  contentDivider: themeSettings.colors.contentDivider,
})

interface PageHeadingColors {
  mainBackground: string
  mainText: string
  extraBackground: string
  extraText: string
  finalStep: string
  label: string
}
export const getPageHeadingColors = (): PageHeadingColors => ({
  mainBackground: themeSettings.colors.pageHeading.mainBackground,
  mainText: themeSettings.colors.pageHeading.mainText,
  extraBackground: themeSettings.colors.pageHeading.extraBackground,
  extraText: themeSettings.colors.pageHeading.extraText,
  finalStep: themeSettings.colors.pageHeading.finalStep,
  label: themeSettings.colors.pageHeading.label,
})

interface ValueLevelColors {
  disabled: string
  low: string
  mid: string
  high: string
  highUpcoming: string
}
export const getValueLevelColors = (): ValueLevelColors => ({
  disabled: themeSettings.colors.valueLevels.disabled,
  low: themeSettings.colors.valueLevels.low,
  mid: themeSettings.colors.valueLevels.mid,
  high: themeSettings.colors.valueLevels.high,
  highUpcoming: themeSettings.colors.valueLevels.highUpcoming,
})

interface ContentBlockColors {
  background: string
  border: string
  borderTerms: string
  selectedBackground: string
  selectedBorder: string
  disabledBackground: string
  disabledBorder: string
  whiteText: string
  mainText: string
  current: string
  warningBackground: string
  warningBorder: string
  warningText: string
  lightText: string
}

export const getContentBlockColors = (): ContentBlockColors => ({
  background: themeSettings.colors.contentBlock.background,
  border: themeSettings.colors.contentBlock.border,
  borderTerms: themeSettings.colors.contentBlock.borderTerms,
  selectedBackground: themeSettings.colors.contentBlock.selectedBackground,
  selectedBorder: themeSettings.colors.contentBlock.selectedBorder,
  disabledBackground: themeSettings.colors.contentBlock.disabledBackground,
  disabledBorder: themeSettings.colors.contentBlock.disabledBorder,
  whiteText: themeSettings.colors.contentBlock.whiteText,
  mainText: themeSettings.colors.contentBlock.mainText,
  current: themeSettings.colors.contentBlock.current,
  warningBackground: themeSettings.colors.contentBlock.warningBackground,
  warningBorder: themeSettings.colors.contentBlock.warningBorder,
  warningText: themeSettings.colors.contentBlock.warningText,
  lightText: themeSettings.colors.contentBlock.lightText,
})

interface FootNoteColors {
  error: string
  danger: string
  warning: string
  info: string
  default: string
}
export const getFootNoteColors = (): FootNoteColors => ({
  error: themeSettings.colors.footNotes.error,
  danger: themeSettings.colors.footNotes.danger,
  warning: themeSettings.colors.footNotes.warning,
  info: themeSettings.colors.footNotes.info,
  default: themeSettings.colors.footNotes.default,
})
