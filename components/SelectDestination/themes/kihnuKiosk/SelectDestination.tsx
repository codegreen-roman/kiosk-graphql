import React, { FC } from 'react'
import { Box, Grid } from '@material-ui/core'
import { SelectDestinationProps } from '@components/SelectDestination'
import { ImageWrapper, RouteMap, RouteTitle } from './SelectDestinationStyles'
import { useRouter } from 'next/router'
import { CustomDestination } from '@interfaces/boraCore'

const SelectDestination: FC<SelectDestinationProps> = ({ sailPackages }) => {
  const { push } = useRouter()

  const handleDestinationClick = (sailPackageCode: string, routeCode: string): void => {
    push(`/select-date/${sailPackageCode}?route=${routeCode}`)
  }

  return (
    <Box display="flex" flexGrow="1">
      <ImageWrapper image="routes-bg">
        <Grid container justify={'center'}>
          {sailPackages.map((destination) => {
            return (
              <Grid item xs={4} key={destination.code}>
                <Box
                  onClick={(): void => handleDestinationClick(destination.code, destination.routeCode)}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <RouteTitle>{destination.title}</RouteTitle>
                  <RouteMap
                    image={
                      destination.code === CustomDestination.MUN_MAN.code
                        ? CustomDestination.MUN_MAN.map
                        : destination.code === CustomDestination.MUN_KIH.code
                        ? CustomDestination.MUN_KIH.map
                        : ''
                    }
                  />
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </ImageWrapper>
    </Box>
  )
}

export default SelectDestination
