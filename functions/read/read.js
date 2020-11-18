const faunadb =require('faunadb')
const q = faunadb.query
require('dotenv').config()

const handler = async (event)=>{
    try{
        const client = new faunadb.Client({secret: process.env.FAUNADB_SECRET})
        var result = await client.query(
            q.Map(
                q.Paginate(q.Documents(q.Collection("message"))),
                q.Lambda(x=>q.Get(x))
            )
        )
        return {
            statusCode: 200,
            body: JSON.stringify(result.data)
        }
    }catch(error){
        return {
            statusCode: 500,
            body: error.toString()
        }
    }
}

module.exports = {handler}