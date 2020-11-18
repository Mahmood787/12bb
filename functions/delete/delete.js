const faunadb = require('faunadb')
const q = faunadb.query
require('dotenv').config()

const handler = async(event)=>{
    try{
        if(event.httpMethod !== "POST"){
            return{
                statusCode:405,
                body: "Method is not allowed"
            }
        }
        const client = new faunadb.Client({secret: process.env.FAUNADB_SECRET})
        const obj = JSON.parse(event.body)
        const result = await client.query(
            q.Delete(q.Ref(q.Collection('message'), obj.id))
        )
        return{
            statusCode: 200,
            body: JSON.stringify({message: `deleted`})
        }
    }catch(error){
        return{
            statusCode: 500,
            body: error.toString()
        }
    }
}
module.exports = {handler}