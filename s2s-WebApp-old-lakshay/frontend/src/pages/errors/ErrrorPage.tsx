import React from 'react'
import { Typography, Container, CssBaseline, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ErrorOutlineSharp } from '@mui/icons-material'

const useStyles = makeStyles((theme: any) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export default function ErrorPage(props: any) {
  const classes = useStyles()

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <div>
          <ErrorOutlineSharp fontSize='large' />
        </div>
        <Typography component='h1' variant='h5'>
          Not Found
        </Typography>
      </div>
    </Container>
  )
}
