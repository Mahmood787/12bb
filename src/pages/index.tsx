import React, { useEffect, useRef, useState, createRef } from "react"
import {Formik, Form, Field} from 'formik'
import * as yup from 'yup';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import './index.css'

interface Data {
  ref: object
  ts: number
  data: {
    message: string
  }
}
const IndexPage = () => {
  
  const [readData, setReadData]= useState<null | Data[]>([])
  const [fetchedData, setFetchedData]=useState(false)
  const [inputTexdId, setInputTextId]=useState<null | number>()
  
  
  useEffect(()=>{
    
  })
  useEffect(()=>{
    (async()=>{
      await fetch("/.netlify/functions/read")
      .then(res=> res.json())
      .then((data)=>{
        setReadData(data)
      })
    })()
  },[fetchedData])
  //delete
  const deleteMessage =async (message)=>{
    await fetch('/.netlify/functions/delete',{
      method: "post",
      body: JSON.stringify({ id: message.ref["@ref"].id }),
    })
    setFetchedData(true)
    setFetchedData(false)
  }
  
  let schema = yup.object().shape({
    message: yup.string().required("This field is required")    
  })

  return (
<>
  <div>
    <AppBar style={{background:"8D07F6"}} position="static">

    </AppBar>
  </div>
    <div className="container">
    <h1 className="header"><span className="hColor"> C</span>rud <span className="hColor">A</span>pp</h1>
      <div className="from-container">
        <div className="top">
            <p className="para1">Lets create some todos</p>
            <Formik
              validationSchema={schema}
              onSubmit={(value, actions)=>{
                fetch("/.netlify/functions/create",{
                  method:"post",
                  body: JSON.stringify(value)
                })
                actions.resetForm({
                  values:{
                    message: " ",
                  }
                })
                setFetchedData(true)
                setFetchedData(false)
              }}
              initialValues={{
                message: ""
              }}
            >
              {({errors, touched})=>(
              <Form>
                <Field className="main-input" id="message" name="message" rowsMax={4} placeholder="" type="textarea" >
                </Field>
                {errors.message && touched.message ? (
                  <div style={{color:"red"}}>{errors.message}</div>
                ):null}
                <br/>
                <Box mt={1} ml={1} >
                  <Button  className="button1" type="submit" color="secondary" variant="contained">Submit</Button>
                </Box>
              </Form>
              )}
            </Formik> 
          </div>
        <div className="read-data">
          {readData.length >= 1 ? readData.map((res,i)=>(
          <div key={i}>
          <p className="todo-p"> <span>{i+1}- </span>{res.data.message}</p>
          { inputTexdId===i ? (
              <div>
                <div className="form-popup" id="myForm" >
                  <div className="modal-content">
                  <div className="modal-header"></div>
                    <Formik
                      onSubmit={(value, actions)=>{
                        fetch('/.netlify/functions/update',{
                          method: "put",
                          body: JSON.stringify({
                            message: value.messageUpdate,
                            id: res.ref["@ref"].id,})}) 
                        setFetchedData(true)
                        setFetchedData(false)
                        setInputTextId(null)
                        actions.resetForm({values:{messageUpdate: " "}})}}
                      initialValues={{messageUpdate: ""}}
                    >
                    <Form>
                    <div className="modal-body">
                      <Field as="textarea" className="modal-content" id="messageUpdate" name="messageUpdate" placeholder="Update message"/>
                    </div>
                      <Box >
                      <Button  className="text-update-button"type="submit" color="secondary" variant="contained" size="small">Done</Button>
                      </Box>
                    </Form>
                    </Formik>
                    <div className="modal-footer">
                      
                    </div>
                  </div>
                  </div>
              </div>
          ):null}
              <div className="button-group">
              <Box mt={1} pr={2}>
                    <Button 
                      className="button" type="submit" color="secondary" variant="contained" size="small"
                      onClick={()=>{ setInputTextId(i)}}>Update</Button>
                  </Box>
                  <Box mt={1} pr={2} >
                    <Button 
                      className="button" type="submit" color="secondary" variant="contained" size="small"
                      onClick={()=>{deleteMessage(res); }}> Delete</Button>
                  </Box>
              </div>
            </div>
          )):null}
        </div>
      </div>
    </div>
  </>
)
}
export default IndexPage
