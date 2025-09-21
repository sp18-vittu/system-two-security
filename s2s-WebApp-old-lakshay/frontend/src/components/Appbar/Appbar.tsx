import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import DataVaultModel from '../../pages/datavault/DataVaultModel'
import { UserModal } from '../Screens/UserModal'

const drawerWidth = 240

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: 'white',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme?.mixins?.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    paddingLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
    color: 'black',
  },
  title: {
    flexGrow: 1,
    color: 'black',
  },
  appBarSpacer: theme.mixins.toolbar,
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'contents',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}))

function Appbar() {
  const [showModal, setShowModal] = useState(false)
  const classes = useStyles()
  const auth = useSelector((state: any) => state.auth)

  const [showdataModal, setShowdataModal] = React.useState(false)

  const location = useLocation()

  return (
    <div>
      <AppBar position='absolute' className={clsx(classes.appBar, classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.sectionDesktop}>
            <Typography variant='h6' noWrap className={classes.title}>
              {location.pathname === '/app/history'
                ? `Hi, ${auth.user?.email}`
                : location.pathname.split('app/')[1].toLocaleUpperCase()}
            </Typography>
          </div>
          <div>
            {location.pathname === '/app/usersdata' ? (
              <button
                className='bg-green-900 hover:bg-green-900 text-white  font-bold py-2 px-4 rounded inline-flex items-center'
                onClick={() => setShowModal(true)}
              >
                <span>Invite User</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-7 h-6 '
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
                  />
                </svg>
              </button>
            ) : (
              ''
            )}
            {showModal ? (
              <>
                <UserModal action={setShowModal}></UserModal>
              </>
            ) : null}
          </div>
          <div className='float-right'>
            {location.pathname === '/app/datavault' ? (
              <>
                <button
                  className='bg-teal-900 hover:bg-teal-900 text-white  font-bold rounded inline-flex items-center'
                  onClick={() => setShowdataModal(true)}
                >
                  <span>New Datavault</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='w-6 h-6 ml-2'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m6-6H6' />
                  </svg>
                </button>
                {showdataModal ? (
                  <>
                    <DataVaultModel action={setShowdataModal}></DataVaultModel>
                  </>
                ) : null}
              </>
            ) : (
              ''
            )}
          </div>
          <div className='float-right'>
            {location.pathname === '/app/datavault' ? (
              <>
                <button
                  className='bg-teal-900 hover:bg-teal-900 text-white  font-bold py-2 px-4 rounded inline-flex items-center'
                  onClick={() => setShowdataModal(true)}
                >
                  <span>New Datavault</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='w-6 h-6 ml-2'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m6-6H6' />
                  </svg>
                </button>
                {showdataModal ? <></> : null}
              </>
            ) : (
              ''
            )}
          </div>
          <div className={classes.sectionMobile}></div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Appbar
