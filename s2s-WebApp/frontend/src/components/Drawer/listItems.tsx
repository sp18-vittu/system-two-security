import React from 'react'
import List from '@mui/material/List'
import AllInboxIcon from '@mui/icons-material/AllInbox'
import ListItemLink from '../Utils/ListItemLink'
import SchemaIcon from '@mui/icons-material/Schema'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import PeopleIcon from '@mui/icons-material/People'
import GppGoodIcon from '@mui/icons-material/GppGood'
import { withStyles } from '@mui/styles'
import DatasetIcon from '@mui/icons-material/Dataset'

const WhiteTextList = withStyles({
  root: {
    '& .MuiTypography-root, & .MuiSvgIcon-root': {
      color: 'white',
    },
  },
})(List)

export const mainListItems = (
  <WhiteTextList>
    <ListItemLink to='/app/landingpage' primary='Overview' icon={<AllInboxIcon />} />
    <ListItemLink to='/app/history' primary='Chat' icon={<AllInboxIcon />} />
    <ListItemLink to='/app/integrations' primary='Integration' icon={<SchemaIcon />} />
    <ListItemLink to='/app/policies' primary='Policies' icon={<GppGoodIcon />} />
    <ListItemLink to='/app/audit' primary='Audit' icon={<PlaylistAddCheckIcon />} />
    <ListItemLink to='/app/usersdata' primary='Users' icon={<PeopleIcon />} />
    <ListItemLink to='/app/datavault' primary='Data Vault' icon={<DatasetIcon />} />
  </WhiteTextList>
)
