import React from 'react'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://www.synthgate.com/'>
        System Two Security, Inc
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default Copyright
