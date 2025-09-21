import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function PromptWarning(props: any) {
  const [open, setOpen] = React.useState(true)

  const handleClose = () => {
    setOpen(true)
    props.onClose()
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle align='center'>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
