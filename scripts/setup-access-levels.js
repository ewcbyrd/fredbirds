// Test script to set up access level data in MongoDB
// Run with: node scripts/setup-access-levels.js

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DB_NAME = 'fredbirds'

async function setupAccessLevels() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DB_NAME)
    
    // Clear existing test data
    await db.collection('members').deleteMany({ autoEnrolled: true })
    await db.collection('officers').deleteMany({ isTestData: true })
    
    // Add test members
    const testMembers = [
      {
        name: 'John Member',
        email: 'john.member@example.com',
        memberSince: new Date('2020-01-15'),
        status: 'active',
        autoEnrolled: false
      },
      {
        name: 'Jane Birder',
        email: 'jane.birder@gmail.com',
        memberSince: new Date('2021-06-10'),
        status: 'active',
        autoEnrolled: false
      }
    ]
    
    // Add test officers
    const testOfficers = [
      {
        name: 'Sarah Officer',
        email: 'sarah.officer@example.com',
        position: 'Vice President',
        memberSince: new Date('2019-03-01'),
        status: 'active',
        isTestData: true
      },
      {
        name: 'Mike Leader',
        email: 'mike.leader@birdclub.org',
        position: 'Field Trip Coordinator',
        memberSince: new Date('2018-05-20'),
        status: 'active',
        isTestData: true
      }
    ]
    
    // Add test admin
    const testAdmins = [
      {
        name: 'Admin User',
        email: 'admin@birdclub.org',
        position: 'President',
        memberSince: new Date('2017-01-01'),
        status: 'active',
        isAdmin: true,
        isTestData: true
      }
    ]
    
    // Insert test data
    if (testMembers.length > 0) {
      await db.collection('members').insertMany(testMembers)
      console.log(`Inserted ${testMembers.length} test members`)
    }
    
    if (testOfficers.length > 0) {
      await db.collection('officers').insertMany(testOfficers)
      console.log(`Inserted ${testOfficers.length} test officers`)
    }
    
    if (testAdmins.length > 0) {
      await db.collection('officers').insertMany(testAdmins)
      console.log(`Inserted ${testAdmins.length} test admins`)
    }
    
    console.log('\\n=== Access Level Test Data Setup Complete ===')
    console.log('\\nTest Users Created:')
    console.log('Members: john.member@example.com, jane.birder@gmail.com')
    console.log('Officers: sarah.officer@example.com, mike.leader@birdclub.org')
    console.log('Admin: admin@birdclub.org')
    console.log('\\nTo test access levels:')
    console.log('1. Log in with one of these email addresses via Auth0')
    console.log('2. The API will match your email and assign the appropriate role')
    console.log('3. Check your profile menu for role-specific options')
    
  } catch (error) {
    console.error('Error setting up access levels:', error)
  } finally {
    await client.close()
    console.log('\\nDatabase connection closed')
  }
}

// Run the setup
setupAccessLevels().catch(console.error)