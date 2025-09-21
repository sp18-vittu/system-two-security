import React, { useState, useEffect } from 'react'
import { Container, CssBaseline, Button, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import FormControl, { useFormControl } from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import ConnectorsItem from '../../components/Connectors/ConnectorItem'
import AddConnectorDialog from '../../components/Modals/AddConnectorDialog'
import { useSelector, useDispatch, useStore } from 'react-redux'
import Actions from './../../redux/nodes/entities/connectors/actions'
import IntegrationActions from './../../redux/nodes/intergrations/actions'

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
}))

export default function ConnectorsPage() {
  const classes = useStyles()
  const [showAddConnector, setShowAddConnector] = useState(false)
  const [title, setTitle] = useState('')
  const [connectorType, setConnectorType] = useState('')

  const navigateTo = useNavigate()
  const dispatch = useDispatch()

  const connectors = useSelector((state: any) => state.connectors)
  const search = ''
  const list = connectors.list || []
  list && list.push({ connectorType: 'Html' })
  list && list.push({ connectorType: 'Pdf' })
  list && list.push({ connectorType: 'Url' })

  useEffect(() => {
    dispatch(Actions.LoadAll({ search }) as any)
  }, [dispatch, search])

  function addConnector() {
    setShowAddConnector(true)
  }

  const responseCallBack = (url: any) => {
    setShowAddConnector(false)
    window.open(url, '_blank')
    navigateTo('/app/integrations')
  }

  function addintegration(req: any) {
    if (req.title == 'Pdf') {
      dispatch(
        IntegrationActions.uploadPdf(req.formData as any, () => {
          setShowAddConnector(false)
        }) as any,
      )
    } else {
      dispatch(IntegrationActions.createConnector(req, responseCallBack) as any)
    }
  }

  return (
    <Container className={classes.container}>
      <CssBaseline />
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
                <ConnectorsItem
                  title={item.connectorType}
                  onAdd={() => {
                    setTitle(item.connectorType)
                    setConnectorType(item.connectorType)
                    addConnector()
                  }}
                  addable
                />
              </Grid>
            ))}
        </Grid>
      </div>
      {showAddConnector && (
        <AddConnectorDialog
          title={title}
          connectorType={connectorType}
          addConnector={addintegration}
          onClose={() => setShowAddConnector(false)}
        />
      )}
    </Container>
  )
}
