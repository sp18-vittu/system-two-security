import * as React from 'react'
import { Button, MenuItem, Menu } from '@mui/material'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ListItemIcon from '@mui/material/ListItemIcon'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import ImportExportIcon from '@mui/icons-material/ImportExport'

export default function ModuleItem(props: any) {
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
        avatar={<Typography>{props.title}</Typography>}
        action={
          props.addable ? (
            <Button variant='text' onClick={() => props.viewConnector()}>
              Import
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
        <MenuItem key='detach'>
          <ListItemIcon>
            <LinkOffIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>Detach</Typography>
        </MenuItem>
        <MenuItem key='import' onClick={() => props.onImport(props.title)}>
          <ListItemIcon>
            <ImportExportIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>Import</Typography>
        </MenuItem>
      </Menu>
      <CardContent>
        <Typography gutterBottom variant='h6' component='div'>
          {props.label}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Number of documents: 12
        </Typography>
      </CardContent>
    </Card>
  )
}
