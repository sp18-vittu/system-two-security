import React, { useState, useEffect } from 'react'
import { Container, CssBaseline, Grid, CircularProgress, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import AddConnectorDialog from '../../components/Modals/AddConnectorDialog'
import DocumentItem from '../../components/Documents/DocumentItem'
import { useSelector, useDispatch } from 'react-redux'
import Actions from './../../redux/nodes/intergrations/actions'

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
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export default function ConnectorDocuments() {
  const classes = useStyles()
  const showAddConnector = false
  const navigateTo = useNavigate()
  const dispatch = useDispatch()

  const integrations = useSelector((state: any) => state.integrations)
  const search = ''
  const list = integrations?.documents
  const isLoading = integrations?.loading != null ? integrations?.loading : true

  useEffect(() => {
    dispatch(Actions.fetchDocuments('module-synth-flow') as any)
  }, [dispatch, search])

  function addConnector() {
    navigateTo('/app/connectors/documents')
  }

  return (
    <Container className={classes.container}>
      <CssBaseline />
      {isLoading && (
        <div className={classes.paper}>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      )}
      <div className={classes.searchContainer}>
        <Box component='form' noValidate autoComplete='off'>
          <FormControl sx={{ width: '25ch' }}>
            <OutlinedInput placeholder='Search' />
          </FormControl>
        </Box>
      </div>
      <div className={classes.connectorsListContainer}>
        <Grid container spacing={2}>
          {list &&
            list.map((item: any) => (
              <Grid item xs={4} className={classes.connectorItem}>
                <DocumentItem title={item} onAdd={addConnector} />
              </Grid>
            ))}
        </Grid>
      </div>
      {showAddConnector && <AddConnectorDialog title='Salesforce' />}
    </Container>
  )
}
