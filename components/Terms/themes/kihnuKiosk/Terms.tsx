import React, { FC, useState } from 'react'
import { Box } from '@material-ui/core'
import { Text } from '@components/Text'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { TermBox, AgreeBox, BoldTerm } from './TermsStyles'
import { withStyles } from '@material-ui/core/styles'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import { getTextColors } from '@themeSettings'
import { TermsProps } from '@components/Terms'
import { TextType } from '@components/Text/TextProps'
const textColors = getTextColors()

const GreenCheckbox = withStyles({
  root: {
    color: textColors.disabled,
    '&$checked': {
      color: textColors.accent,
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />)

const Terms: FC<TermsProps> = ({ terms, agreement, callBack, hasBoldTerm }) => {
  const [state, setState] = useState({
    checkedG: false,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [event.target.name]: event.target.checked })
    callBack(!state.checkedG)
  }
  return (
    <Box display="flex" width={'100%'} mt={2} flexDirection="column">
      <TermBox>
        {terms.map((term, index) =>
          hasBoldTerm ? (
            <Box key={term} py={0.5}>
              <Text type={TextType.TERMS}>{index === 0 ? <BoldTerm>{term}</BoldTerm> : term}</Text>
            </Box>
          ) : (
            <Box key={term} py={0.5}>
              <Text type={TextType.TERMS}>{term}</Text>
            </Box>
          )
        )}
      </TermBox>
      <AgreeBox display-if={agreement}>
        <FormControlLabel
          control={<GreenCheckbox checked={state.checkedG} onChange={handleChange} name="checkedG" />}
          label={<Text type={TextType.PAYMENT}>{agreement}</Text>}
        />
      </AgreeBox>
    </Box>
  )
}

export default Terms
