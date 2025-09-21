import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}))

export default function SearchComponent(props: any) {
  const classes = useStyles()
  const [search, setSearch] = useState(0)

  function handleSubmit(event: any) {
    props.handleSearch(search)
    event.preventDefault()
  }

  return (
    <Paper
      component='form'
      className={classes.root}
      square={true}
      elevation={0}
      onSubmit={handleSubmit}
    >
      <InputBase
        className={classes.input}
        placeholder='Search '
        inputProps={{ 'aria-label': 'search google maps' }}
        onChange={(e: any) => setSearch(e.target.value)}
      />
      <IconButton type='submit' className={classes.iconButton} aria-label='search'>
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
