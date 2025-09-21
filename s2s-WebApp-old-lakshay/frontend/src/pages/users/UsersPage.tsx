import * as React from 'react'
import {
  Typography,
  Container,
  CssBaseline,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'

const useStyles = makeStyles((theme: any) => ({
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
  },
  header: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
}))

export default function UsersPage() {
  const classes = useStyles()
  const [data, setData] = React.useState([
    {
      id: 6,
      name: 'Manager',
      email: 'Mani@synthgate.ai',
      role: 'Owner',
      docs: 100,
    },
    {
      id: 6,
      name: 'Agent',
      email: 'Vinith@synthgate.ai',
      role: 'Reader',
      docs: 3,
    },
    {
      id: 6,
      name: 'Customer',
      email: 'pritam@synthgate.ai',
      role: 'Reader',
      docs: 3,
    },
  ])

  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false)
  const [inviteName, setInviteName] = React.useState('')
  const [inviteEmail, setInviteEmail] = React.useState('')
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState({ id: '', name: '' })

  const handleRoleChange = (id: string, event: any) => {
    const newData = data.map((item: any) => {
      if (item.id === id) {
        return { ...item, role: event.target.value }
      }
      return item
    })
    setData(newData)
  }

  const handleInviteUser = () => {
    setInviteDialogOpen(true)
  }

  const handleInviteDialogClose = () => {
    setInviteDialogOpen(false)
  }

  const handleInviteDialogSubmit = () => {
    const newUser = {
      id: data.length + 1,
      name: inviteName,
      email: inviteEmail,
      role: 'Reader', // Set the default role here
    }
    setData([...data, newUser])
    setInviteDialogOpen(false)
    setInviteName('')
    setInviteEmail('')
  }

  const handleRemoveUser = (user: any) => {
    setSelectedUser(user)
    setRemoveDialogOpen(true)
  }

  const handleRemoveDialogClose = () => {
    setRemoveDialogOpen(false)
  }

  const handleRemoveUserConfirm = () => {
    const newData = data.filter((item: any) => item.id !== selectedUser.id)
    setData(newData)

    setRemoveDialogOpen(false)
  }

  return (
    <Container className={classes.container}>
      <CssBaseline />
      <div className={classes.header}>
        <Grid container spacing={15}>
          <Grid item spacing={3}></Grid>
          <Grid item spacing={3}>
            <Box
              sx={{
                marginTop: '1px',
                marginLeft: '800px',
                marginBottom: '5px',
              }}
            >
              <div>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  onClick={handleInviteUser}
                >
                  Invite User <PersonAddAltOutlinedIcon />
                </Button>
              </div>
            </Box>
          </Grid>
        </Grid>
      </div>

      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Docs</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Select value={item.role} onChange={(e: any) => handleRoleChange(item.id, e)}>
                    <MenuItem value='Owner'>Owner</MenuItem>
                    <MenuItem value='Writer'>Writer</MenuItem>
                    <MenuItem value='Reader'>Reader</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>Docs: {item.docs}</TableCell>
                <TableCell>
                  <Button size='small' onClick={() => handleRemoveUser(item)}>
                    <PersonRemoveIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={inviteDialogOpen}
        onClose={handleInviteDialogClose}
        PaperProps={{ style: { maxWidth: '400px', width: '100%' } }}
      >
        <DialogTitle>
          <div>
            <Typography variant='h6'>Invite User</Typography>
          </div>
          <div>
            <Typography>Please fill in the credentials below</Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <label>Name</label>
          <TextField
            label='User Name'
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            fullWidth
            margin='normal'
          />
          <label>Email Address</label>
          <TextField
            label='Email Address'
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            fullWidth
            margin='normal'
          />
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleInviteDialogClose} variant='outlined'>
              Cancel
            </Button>
          </Box>
          <Box>
            <Button onClick={handleInviteDialogSubmit} variant='contained' color='primary'>
              Invite
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog open={removeDialogOpen} onClose={handleRemoveDialogClose}>
        <DialogTitle>Remove User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove the user: {selectedUser && selectedUser.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveDialogClose} variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleRemoveUserConfirm} color='error' variant='contained'>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
