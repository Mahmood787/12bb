const faunadb = require('faunadb')
const q = faunadb.query
require('dotenv').config()

const handler = async(event)=>{
    try{
        const client = new faunadb.Client({secret:process.env.FAUNADB_SECRET})
        const obj = JSON.parse(event.body)
        const result = await client.query(
            q.Update(q.Ref(q.Collection('message'), obj.id), {
                data:{message: obj.message}
            })
        )
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `${obj.message}` })
          }
        } catch (error) {
          return { statusCode: 500, body: error.toString() }
        }
    }
module.exports = {handler}