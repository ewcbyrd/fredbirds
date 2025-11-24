import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { getAnnouncements } from '../services/restdbService'

export default function Announcements(){
  const [items, setItems] = useState([])

  useEffect(()=>{
    getAnnouncements().then(data=> setItems(data || []))
  },[])

  if (!items.length) return (<Typography variant="body1" color="text.secondary">There is no current club news</Typography>)

  return (
    <Grid container spacing={2}>
      {items.map(item=> (
        <Grid item xs={12} key={item._id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{item.headline}</Typography>
              <Typography variant="body2" dangerouslySetInnerHTML={{__html:item.details}} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
