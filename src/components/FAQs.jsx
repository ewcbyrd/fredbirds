import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getFaqs } from '../services/restdbService'

export default function FAQs(){
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    getFaqs()
      .then(res => { const items = Array.isArray(res) ? res : res || []; setFaqs(items) })
      .catch(err=>console.error('getFaqs', err))
      .finally(()=>setLoading(false))
  },[])

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ bgcolor: 'white', p:2, borderRadius:1 }}>
        <Typography variant="h5" sx={{ mb:2 }}>FAQ's</Typography>
        {loading && <Typography>Loading...</Typography>}
        {!loading && faqs.length===0 && <Typography>No FAQs available.</Typography>}
        {faqs.map((f) => (
          <Accordion key={f._id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{f.question || f.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div dangerouslySetInnerHTML={{ __html: f.answer || f.content || '' }} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  )
}
