import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import { mainListItems } from './listItems'
import { List } from '@mui/material'
import ListItemLink from '../Utils/ListItemLink'
import SettingsIcon from '@mui/icons-material/Settings'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import Synthfulllogo from './../../pages/logo/Synthfulllogo'

const drawerWidth = 240

const useStyles = makeStyles((theme: any) => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px',
    minHeight: '30px',
    ...theme.mixins.toolbar,
    backgroundColor: '#0c111d',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#0c111d',
  },
  mainList: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  bottomMenu: {
    marginTop: 'auto',
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    backgroundColor: '#0c111d',
  },
}))

function Drawermenu(props: any) {
  const classes = useStyles()

  const WhiteTextList = withStyles({
    root: {
      '& .MuiTypography-root, & .MuiSvgIcon-root': {
        color: 'white',
      },
    },
  })(List)

  return (
    <Drawer
      variant='permanent'
      classes={{
        paper: clsx(classes.drawerPaper, !props.open && classes.drawerPaperClose),
      }}
      open={props.open}
    >
      <div className={classes.toolbarIcon}>
        <Synthfulllogo />
      </div>
      <Divider />
      <div className={classes.drawerContainer}>
        <div className={classes.mainList}>{mainListItems}</div>
      </div>
      <div className={classes.bottomMenu}>
        <WhiteTextList>
          <ListItemLink to='/app/support' primary='Support' icon={<SportsSoccerIcon />} />
          <ListItemLink to='/app/settings' primary='Settings' icon={<SettingsIcon />} />
        </WhiteTextList>
      </div>
    </Drawer>
  )
}

export default Drawermenu
