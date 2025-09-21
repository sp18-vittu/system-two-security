import React, { useEffect } from 'react'
import {
  Typography,
  Container,
  CssBaseline,
  Button,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { useSelector, useDispatch } from 'react-redux'
import Actions from './../../redux/nodes/entities/connectors/actions'
import ConnectorsItem from '../../components/Connectors/ConnectorItem'

const useStyles = makeStyles((theme: any) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
  },
  emptyMsg: {
    margin: theme.spacing(2),
  },
  connectorsListContainer: {
    paddingTop: theme.spacing(2),
  },
  connectorItem: {
    padding: theme.spacing(1),
  },
}))

export default function IntegrationsPageWrapper() {
  const classes = useStyles()
  const navigateTo = useNavigate()
  const dispatch = useDispatch()

  const connectors = useSelector((state: any) => state.connectors)
  const search = ''
  const list = connectors.list || []

  useEffect(() => {
    dispatch(Actions.LoadAll({ search }) as any)
  }, [dispatch, search])

  function handleNew() {
    navigateTo('/app/connectors')
  }

  const viewConnectorCallBck = () => {
    navigateTo('/app/connectors/details/1')
  }

  return (
    <Container
      component='main'
      maxWidth={list.length > 0 ? 'lg' : 'xs'}
      className={list.length > 0 ? classes.container : ''}
    >
      <CssBaseline />
      {connectors.loading && (
        <div className={classes.paper}>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      )}
      {list.length > 0 && (
        <div className={classes.btnContainer}>
          <Button variant='contained' endIcon={<AddIcon />} onClick={handleNew}>
            New Integration
          </Button>
        </div>
      )}
      {list.length == 0 && (
        <div className={classes.paper}>
          <div>
            <SearchIcon fontSize='large' />
          </div>
          <div className={classes.emptyMsg}>
            <Typography component='h1' variant='h5'>
              No Integrations found
            </Typography>
          </div>
          <Button variant='contained' endIcon={<AddIcon />} onClick={handleNew}>
            New Integration
          </Button>
        </div>
      )}
      {list.length > 0 && (
        <div className={classes.connectorsListContainer}>
          <Grid container spacing={2}>
            {list &&
              list.map((item: any) => (
                <Grid item xs={4} className={classes.connectorItem}>
                  <ConnectorsItem
                    title={item.connectorType}
                    addable={false}
                    viewConnector={viewConnectorCallBck}
                  />
                </Grid>
              ))}
          </Grid>
        </div>
      )}
    </Container>
  )
}
