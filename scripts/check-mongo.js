// Simple script to verify MongoDB connection and inspect the `users` collection.
// Usage (PowerShell):
// $env:MONGODB_URI = "your-mongo-uri"; node scripts/check-mongo.js

const { MongoClient } = require('mongodb')

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('ERROR: MONGODB_URI environment variable is not set.')
    process.exit(2)
  }

  console.log('Connecting to MongoDB...')
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('Connected.')

    // List databases
    const admin = client.db().admin()
    const dbs = await admin.listDatabases()
    console.log('Databases:')
    dbs.databases.forEach(d => console.log(' -', d.name))

    // Try to find the "magnus-pharma" database or show current DB
    const dbName = client.s.options.dbName || 'magnus-pharma'
    console.log('\nInspecting database:', dbName)
    const db = client.db(dbName)

    const collections = await db.listCollections().toArray()
    console.log('Collections:')
    collections.forEach(c => console.log(' -', c.name))

    // Check users collection
    const users = db.collection('users')
    const count = await users.countDocuments()
    console.log(`\nusers collection count: ${count}`)
    if (count > 0) {
      const one = await users.findOne()
      console.log('One user (masked):')
      if (one) {
        const masked = Object.assign({}, one)
        if (masked.password) masked.password = '***masked***'
        console.log(masked)
      }
    } else {
      console.log('No users found. If you expect users, ensure your app is connected to the same URI and you ran signup.')
    }
  } catch (err) {
    console.error('Connection error:', err.message || err)
    process.exitCode = 1
  } finally {
    await client.close()
  }
}

main()

