import React, { FC, useEffect, useContext, useMemo } from 'react'
import Countdown from 'react-countdown'
import { Box } from '@material-ui/core'
import { TimerProps } from '@components/Timer'
import { Title, Counter } from './TimerStyles'
import { TimerContext } from '@components/Layout/themes/kihnuKiosk/Layout'
import { useTranslation } from 'react-i18next'

const renderer = (props): React.ReactNode => {
  return (
    <Box>
      <Title display-if={props.isTitleNeeded} color={props.color}>
        {props.label}
      </Title>
      {props.onlySeconds ? (
        <Counter color={props.color} onlySeconds={props.onlySeconds}>
          {props.formatted.seconds}
        </Counter>
      ) : (
        <Counter color={props.color}>
          {props.isUpcoming
            ? `${props.formatted.hours}:${props.formatted.minutes}:${props.formatted.seconds}`
            : `${props.formatted.days}:${props.formatted.hours}:${props.formatted.minutes}:${props.formatted.seconds}`}
        </Counter>
      )}
    </Box>
  )
}

const Timer: FC<TimerProps> = ({ date, color, isTitleNeeded = true, isUpcoming = false, direction, onlySeconds }) => {
  const { t } = useTranslation()
  const [isTimeUp, setTimeIsUp] = useContext(TimerContext)
  const callBack = (direction: string): void => {
    if (isTimeUp.length > 0) {
      setTimeIsUp((prevArray) => {
        const array = [...prevArray]
        const ind = array.findIndex((el) => el.direction === direction)
        array[ind].isTimeUpFlag = true
        return array
      })
    }
  }
  // shouldSkipRender - if equals true than the component will not be re-rendered, otherwise re-render will happen
  const shouldSkipRender = isTimeUp.length && !isTimeUp.find((it) => it.isTimeUpFlag === false)
  useEffect(() => {
    setTimeIsUp((oldArray) => [
      ...oldArray,
      {
        isTimeUpFlag: false,
        direction: direction,
      },
    ])
  }, [])
  return useMemo(() => {
    return (
      <Countdown
        date={date}
        renderer={(props): React.ReactNode =>
          renderer({
            ...props,
            color,
            isTitleNeeded,
            isUpcoming,
            callBack,
            direction,
            label: t('Extra tickets label'),
            onlySeconds,
          })
        }
        onComplete={(): void => callBack(direction)}
      />
    )
  }, [shouldSkipRender])
}

export default Timer
