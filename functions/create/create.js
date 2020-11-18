const faunadb = require('faunadb')
const q = faunadb.query
require('dotenv').config()

const handler = async (event) => {
  try {
    if(event.httpMethod !== "POST"){
      return{
        statusCode: 405,
        body: "Method is not allwed" 
      }
    }
    const client = new faunadb.Client({secret:process.env.FAUNADB_SECRET})
    const obj = JSON.parse(event.body)

    let result = await client.query(
      q.Create(q.Collection('message'), {data: obj})
    )
    const subject = event.queryStringParameters.name || "World"
    return {
      statusCode: 200,
      body: JSON.stringify({id: `${result.ref.id}`})
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
