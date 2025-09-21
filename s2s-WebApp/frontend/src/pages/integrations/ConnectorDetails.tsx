import React, { useState, useEffect } from 'react'
import {
  Typography,
  Container,
  CssBaseline,
  Grid,
  Avatar,
  CircularProgress,
  Box,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import ModuleItem from '../../components/Connectors/ModuleItem'
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
    marginTop: theme.spacing(2),
  },
  connectorsListContainer: {
    paddingTop: theme.spacing(3),
  },
  connectorItem: {
    padding: theme.spacing(1),
  },
  header: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  summary: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'start',
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

export default function ConnectorsDetails() {
  const classes = useStyles()
  const navigateTo = useNavigate()
  const dispatch = useDispatch()

  const integrations = useSelector((state: any) => state.integrations)
  const search = ''
  const modObjects = integrations.modules?.Objects || []
  const list = [...modObjects, ...[]]
  const isLoading = integrations?.loading != null ? integrations?.loading : true

  useEffect(() => {
    dispatch(Actions.fetchModules('SynthGate-Salesforce-MANI-CONN') as any)
  }, [dispatch, search])

  function viewConnector() {
    navigateTo('/app/connectors/documents')
  }

  const importModule = (moduleName: string) => {
    dispatch(
      Actions.imporModules({
        s3bucketName: 'synthgate-salesforce-bucket',
        connectorProfileName: 'SynthGate-Salesforce-MANI-CONN',
        moduleName: moduleName,
        flowName: 'module-synth-flow',
      }) as any,
    )
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
      <div className={classes.header}>
        <Grid container spacing={15}>
          <Grid item spacing={3}>
            <Avatar alt='Remy Sharp' src='/Salesforce-logo.webp' sx={{ width: 75, height: 56 }} />
            <Typography variant='h5' fontWeight='bold'>
              SalesForce
            </Typography>
          </Grid>
          <Grid item spacing={3}>
            <Box sx={{ marginTop: '50px' }}>
              <div>
                <span>Last Sync: </span>
                <span> Yesterday</span>
              </div>
              <div>
                <span>Data Sync: </span>
                <span> 10Mb</span>
              </div>
            </Box>
          </Grid>
          <Grid item spacing={3}>
            <Box sx={{ marginTop: '50px' }}>
              <div>
                <span>Change: </span>
                <span>Frequency</span>
              </div>
              <div>
                <span>Drift Detected: </span>
                <span>No Correction required</span>
              </div>
            </Box>
          </Grid>
        </Grid>
      </div>
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
                <ModuleItem
                  title={item.name}
                  label={item.label}
                  viewConnector={viewConnector}
                  onImport={importModule}
                />
              </Grid>
            ))}
        </Grid>
      </div>
    </Container>
  )
}
