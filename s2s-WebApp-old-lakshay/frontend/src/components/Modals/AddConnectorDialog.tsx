import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useInput from '../Utils/hooks/useInput'
import { useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab'

export default function AddConnectorDialog(props: any) {
  const [open, setOpen] = React.useState(true)
  const auth = useSelector((state: any) => state.auth)

  const { value: clientid, bind: clientidBind, reset: clientidReset } = useInput('')
  const { value: secret, bind: secretBind, reset: secretReset } = useInput('')
  const { value: title, bind: titleBind, reset: titleReset } = useInput('')
  const { value: url, bind: urlBind, reset: urlReset } = useInput('')
  const [file, setFile] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const uploadPdf = () => {
    // Call API with payload = data...
    const meta = {
      index: 'manuals',
      user: auth.user?.email,
      relation: 'owner',
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('metadata', JSON.stringify(meta))

    props.addConnector({
      formData: formData,
      title: 'Pdf',
    })
  }

  const handleSubmit = (evt: any) => {
    evt.preventDefault()
    setLoading(true)
    if (props.title === 'Pdf') {
      uploadPdf()
    } else {
      props.addConnector({
        consumerKey: clientid,
        consumerSecret: secret,
        connectionProfileName: 'MANI-CONN',
        title: props.title,
      })
    }
  }

  const handleClose = () => {
    setOpen(true)
    props.onClose()
  }

  const handleFile = (event: any) => {
    setFile(event.target.files[0])
  }

  let dialogContent
  if (props.title === 'Pdf') {
    dialogContent = (
      <div>
        <TextField
          autoFocus
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='title'
          label='Title'
          type='text'
          autoComplete='title'
          {...titleBind}
        />
        <input type='file' id='pdfFile' name='myfile' onChange={handleFile} />
      </div>
    )
  } else if (props.title === 'Html') {
    dialogContent = (
      <div>
        <TextField
          autoFocus
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='title'
          label='Title'
          type='text'
          autoComplete='title'
          {...titleBind}
        />
        <input id='htmFile' type='file' name='myFile' />
      </div>
    )
  } else if (props.title === 'Url') {
    ;<p>Add a title and URL link below:</p>
    dialogContent = (
      <div>
        <TextField
          autoFocus
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='title'
          label='Title'
          type='text'
          autoComplete='title'
          {...titleBind}
        />
        <TextField
          autoFocus
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='url'
          label='Url Link'
          type='url'
          autoComplete='url'
          {...urlBind}
        />
      </div>
    )
  } else {
    dialogContent = (
      <div>
        <TextField
          autoFocus
          margin='normal'
          required
          fullWidth
          id='clientId'
          label='Client Id/User Id'
          type='clientId'
          variant='standard'
          autoComplete='ClientId'
          {...clientidBind}
        />
        <TextField
          autoFocus
          margin='normal'
          required
          id='secret'
          label='Secret'
          type='password'
          fullWidth
          variant='standard'
          {...secretBind}
        />
      </div>
    )
  }
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle align='center'>Add {props.title}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='button'>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            loadingIndicator='Loading'
            type='button'
            variant='contained'
            color='primary'
            onClick={handleSubmit}
          >
            <span>Add</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}
