// API endpoint for determining user roles
// This can be deployed to Vercel, Netlify, or your preferred serverless platform

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'fredbirds'

let cachedClient = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }

  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  await client.connect()
  cachedClient = client
  return client
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, auth0Id } = req.body

    console.log('Role lookup request:', { email, auth0Id })

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const client = await connectToDatabase()
    const db = client.db(DB_NAME)
    
    // Check officers collection first (highest priority)
    console.log('Searching officers collection for:', email)
    const officer = await db.collection('officers').findOne({
      $or: [
        { email: { $regex: new RegExp(email, 'i') } },
        { auth0Id: auth0Id }
      ]
    })

    console.log('Officer found:', officer)

    if (officer) {
      let role = 'officer'
      
      // Check for admin privileges
      if (officer.isAdmin || 
          officer.role === 'admin' || 
          officer.position?.toLowerCase().includes('president') ||
          officer.position?.toLowerCase().includes('chair')) {
        role = 'admin'
      }

      console.log('Assigned role:', role)

      // Update auth0Id if not set
      if (!officer.auth0Id && auth0Id) {
        await db.collection('officers').updateOne(
          { _id: officer._id },
          { $set: { auth0Id: auth0Id } }
        )
      }

      return res.status(200).json({ 
        role,
        user: {
          name: officer.name,
          position: officer.position,
          email: officer.email
        }
      })
    }

    // Check members collection
    console.log('Searching members collection for:', email)
    const member = await db.collection('members').findOne({
      $or: [
        { email: { $regex: new RegExp(email, 'i') } },
        { auth0Id: auth0Id }
      ]
    })

    console.log('Member found:', member)

    if (member) {
      // Update auth0Id if not set
      if (!member.auth0Id && auth0Id) {
        await db.collection('members').updateOne(
          { _id: member._id },
          { $set: { auth0Id: auth0Id } }
        )
      }

      console.log('Assigning member role')
      return res.status(200).json({ 
        role: 'member',
        user: {
          name: member.name,
          email: member.email,
          memberSince: member.memberSince
        }
      })
    }

    // Check for auto-enrollment based on email domain
    console.log('No existing record found, auto-enrolling as member')
    const emailDomain = email.split('@')[1]
    const trustedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
    
    // For now, any authenticated user becomes a member
    // You can customize this logic based on your club's requirements
    const newMember = {
      email: email,
      auth0Id: auth0Id,
      name: email.split('@')[0], // Default name from email
      memberSince: new Date(),
      status: 'pending', // Requires approval
      autoEnrolled: true
    }

    await db.collection('members').insertOne(newMember)

    return res.status(200).json({ 
      role: 'member',
      user: {
        name: newMember.name,
        email: newMember.email,
        memberSince: newMember.memberSince,
        status: 'pending'
      }
    })

  } catch (error) {
    console.error('Error determining user role:', error)
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    })
  }
}