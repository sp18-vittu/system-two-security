import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signup } from '../../redux/nodes/auth/actions'
import { useInput } from '../../components/Utils/hooks/useInput'
import Copyright from '../../components/Common/CopyRight'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import Container from '@mui/material/Container'
import Alert from '@mui/lab/Alert'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import STwoSLogo from '../logo/STwoSLogo'

const useStyles = makeStyles((theme: any) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
}))

export default function SignUp() {
  const classes = useStyles()
  const { value: firstName, bind: firstNameBind, reset: firstNameReset } = useInput('')
  const { value: lastName, bind: lastNameBind, reset: lastNameReset } = useInput('')
  const { value: email, bind: emailBind, reset: emailReset } = useInput('')
  const { value: password, bind: passwordBind, reset: passwordReset } = useInput('')
  const [open, setOpen] = useState(true)
  const dispatch = useDispatch()

  const auth = useSelector((state: any) => state.auth)

  const navigateTo = useNavigate()

  function redirectToApp() {
    navigateTo('/app')
  }

  useEffect(() => {
    if (auth?.user != null && auth?.isAuthenticated) {
      redirectToApp()
    }
    if (auth?.errors?.error) {
    }
  }, [auth])

  const submit = (evt: any) => {
    evt.preventDefault()
    setOpen(true)
    dispatch(signup({ firstName, lastName, email, password }) as any)
  }

  return (
    <Container component='main' maxWidth='xs' className='bg-[white]'>
      <CssBaseline />
      <div className={classes.paper}>
        <STwoSLogo />
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={submit}>
          {auth?.errors?.error ? (
            <Collapse in={open}>
              <Alert
                className={classes.alert}
                severity='error'
                action={
                  <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <CloseIcon fontSize='inherit' />
                  </IconButton>
                }
              >
                {auth.errors.message}
              </Alert>
            </Collapse>
          ) : (
            ''
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='fname'
                name='firstName'
                variant='outlined'
                required
                fullWidth
                id='firstName'
                label='First Name'
                {...firstNameBind}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='lastName'
                label='Last Name'
                name='lastName'
                autoComplete='lname'
                {...lastNameBind}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                {...emailBind}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                {...passwordBind}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <Link to='/signin'>Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}
