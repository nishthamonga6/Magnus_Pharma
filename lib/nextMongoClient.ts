import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''

let client: MongoClient | undefined
let clientPromise: Promise<any>

declare const global: any

if (!uri) {
  // No Mongo URI configured — create a persistent in-memory store so signup/login
  // work during local development without a DB. This is only intended for dev/demo.
  if (!global.__INMEM_DB__) {
    const collections = new Map()

    function makeCollection(name) {
      if (collections.has(name)) return collections.get(name)
      const store = new Map()
      let idCounter = 1

      const coll = {
        async findOne(filter = {}) {
          for (const doc of store.values()) {
            let ok = true
            for (const k of Object.keys(filter)) {
              // simple equality match
              if (String((doc)[k]) !== String((filter)[k])) { ok = false; break }
            }
            if (ok) return Object.assign({}, doc)
          }
          return null
        },
        async insertOne(doc = {}) {
          const id = String(idCounter++)
          const stored = Object.assign({ _id: id }, doc)
          store.set(id, stored)
          return { insertedId: id }
        },
        async updateOne(filter = {}, update = {}) {
          const found = await coll.findOne(filter)
          if (!found) return { matchedCount: 0, modifiedCount: 0 }
          const id = found._id
          const existing = store.get(String(id))
          // apply simple $set behavior
          if (update && update['$set']) {
            Object.assign(existing, update['$set'])
          }
          store.set(String(id), existing)
          return { matchedCount: 1, modifiedCount: 1 }
        },
        async deleteMany(filter = {}) {
          let removed = 0
          const toRemove = []
          for (const [id, doc] of store.entries()) {
            let ok = true
            for (const k of Object.keys(filter)) {
              if (String(doc[k]) !== String(filter[k])) { ok = false; break }
            }
            if (ok) toRemove.push(id)
          }
          for (const id of toRemove) { store.delete(id); removed++ }
          return { acknowledged: true, deletedCount: removed }
        },
        async countDocuments() { return store.size },
        find() {
          const arr = Array.from(store.values()).map(d => Object.assign({}, d))
          return { toArray: async () => arr }
        }
      }
      collections.set(name, coll)
      return coll
    }

    global.__INMEM_DB__ = { makeCollection }
  }

  clientPromise = Promise.resolve({
    db() {
      return {
        collection(name) {
          return global.__INMEM_DB__.makeCollection(name)
        }
      }
    }
  })
} else {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(uri)
    clientPromise = client.connect()
  }
}

export default clientPromise
