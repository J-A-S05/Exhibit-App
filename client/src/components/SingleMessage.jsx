import React from 'react'
import { Box , Typography } from '@mui/material'
const SingleMessage = ({align , text}) => {
  return (
    <Box display="flex" flexDirection="column"  alignItems={align} textAlign = "right">
        {text}
    </Box>
  )
}

export default SingleMessage
