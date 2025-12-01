// Quick script to check officer records for debugging
// Run with: node scripts/check-user-record.js scottbyrd681@gmail.com

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'fredbirds'

const email = process.argv[2]

if (!email) {
  console.log('Usage: node scripts/check-user-record.js <email>')
  process.exit(1)
}

async function checkUserRecord() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DB_NAME)
    
    console.log(`\n=== Checking records for: ${email} ===\n`)
    
    // Check officers collection
    console.log('1. Checking officers collection...')
    const officers = await db.collection('officers').find({
      email: { $regex: new RegExp(email, 'i') }
    }).toArray()
    
    if (officers.length > 0) {
      console.log('Officers found:', officers.length)
      officers.forEach((officer, i) => {
        console.log(`  Officer ${i + 1}:`)
        console.log(`    Name: ${officer.name}`)
        console.log(`    Email: ${officer.email}`)
        console.log(`    Position: ${officer.position}`)
        console.log(`    Role: ${officer.role}`)
        console.log(`    IsAdmin: ${officer.isAdmin}`)
        console.log(`    Auth0ID: ${officer.auth0Id}`)
        console.log(`    Created: ${officer._id?.getTimestamp?.()}`)
        
        // Check what role would be assigned
        let assignedRole = 'officer'
        if (officer.isAdmin || 
            officer.role === 'admin' || 
            officer.position?.toLowerCase().includes('president') ||
            officer.position?.toLowerCase().includes('chair')) {
          assignedRole = 'admin'
        }
        console.log(`    → Would assign role: ${assignedRole}`)
        console.log()
      })
    } else {
      console.log('  No officers found')
    }
    
    // Check members collection
    console.log('2. Checking members collection...')
    const members = await db.collection('members').find({
      email: { $regex: new RegExp(email, 'i') }
    }).toArray()
    
    if (members.length > 0) {
      console.log('Members found:', members.length)
      members.forEach((member, i) => {
        console.log(`  Member ${i + 1}:`)
        console.log(`    Name: ${member.name}`)
        console.log(`    Email: ${member.email}`)
        console.log(`    Status: ${member.status}`)
        console.log(`    Auth0ID: ${member.auth0Id}`)
        console.log(`    Member Since: ${member.memberSince}`)
        console.log(`    Auto-enrolled: ${member.autoEnrolled}`)
        console.log()
      })
    } else {
      console.log('  No members found')
    }
    
    // Show collections info
    console.log('3. Collection stats:')
    const officersCount = await db.collection('officers').countDocuments()
    const membersCount = await db.collection('members').countDocuments()
    console.log(`  Officers collection: ${officersCount} documents`)
    console.log(`  Members collection: ${membersCount} documents`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('\nDatabase connection closed')
  }
}

checkUserRecord().catch(console.error)