import React from 'react'
import {
  Typography,
  Container,
  CssBaseline,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import BookIcon from '@mui/icons-material/Book'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme: any) => ({
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
  },
  connectorsListContainer: {
    paddingTop: theme.spacing(2),
  },
  connectorItem: {
    padding: theme.spacing(1),
  },
  link: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))

export default function PromptCard() {
  const classes = useStyles()

  return (
    <Container className={classes.container}>
      <CssBaseline />
      <div className={classes.connectorsListContainer}>
        <Grid container spacing={2}>
          <Grid item xs={4} className={classes.connectorItem}>
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Typography>
                    <IntegrationInstructionsIcon />
                  </Typography>
                }
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Documentation
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Dive in to learn all about the products.
                </Typography>
                <Link className={classes.link} to=''>
                  Start Learning <ArrowForwardIcon />
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} className={classes.connectorItem}>
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Typography>
                    <BookIcon />
                  </Typography>
                }
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Our Blog
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Read the latest posts on our blog.
                </Typography>
                <Link className={classes.link} to=''>
                  View latest posts <ArrowForwardIcon />
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} className={classes.connectorItem}>
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Typography>
                    <QuestionAnswerIcon />
                  </Typography>
                }
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Chat with Us
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Can't find what you're looking for.
                </Typography>
                <Link className={classes.link} to=''>
                  Chat with our team <ArrowForwardIcon />
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Container>
  )
}
