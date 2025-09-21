import * as React from 'react'
import { MenuItem } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function DocumentItem(props: any) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {props.title}
        </Typography>
        <div style={{ padding: '20px 0px' }}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Permission</InputLabel>
            <Select labelId='demo-simple-select-label' id='demo-simple-select' label='Permission'>
              <MenuItem value={10}>Employee</MenuItem>
              <MenuItem value={20}>Manager</MenuItem>
              <MenuItem value={30}>Executive</MenuItem>
              <MenuItem value={30}>None</MenuItem>
            </Select>
          </FormControl>
        </div>
      </CardContent>
    </Card>
  )
}
