import * as React from 'react'
import { Button, MenuItem, Menu } from '@mui/material'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ListItemIcon from '@mui/material/ListItemIcon'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

export default function ConnectorsItem(props: any) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar
            alt={props.title}
            src={`/${props.title}-logo.jpg`}
            sx={{ width: 56, height: 56 }}
          />
        }
        action={
          props.addable ? (
            <Button variant='text' onClick={() => props.onAdd()}>
              Add
            </Button>
          ) : (
            <IconButton
              aria-label='more'
              id='long-button'
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup='true'
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          )
        }
      />
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 40 * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem key='view' onClick={() => props.viewConnector()}>
          <ListItemIcon>
            <RemoveRedEyeIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>View</Typography>
        </MenuItem>
        <MenuItem key='edit'>
          <ListItemIcon>
            <LinkOffIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>Edit</Typography>
        </MenuItem>
        <MenuItem key='delete'>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>Delete</Typography>
        </MenuItem>
      </Menu>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {props.title}
        </Typography>
        {!props.addable && (
          <React.Fragment>
            <Typography variant='body2' color='text.secondary'>
              Last Sync: Yesterday
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Date Synced: 10MB
            </Typography>
          </React.Fragment>
        )}
      </CardContent>
    </Card>
  )
}
