import React, { useState } from 'react'
import * as R from 'ramda'
import XLSX from 'xlsx'
import ReactFileReader from 'react-file-reader'
import SHA256 from 'crypto-js/sha256'

import './createShadowedFile.css'

const EMAIL_COLUMN = 'email'
const CSV_HEADER_FILE_NAME = 'data:text/csv;charset=utf-8,'
const EXPORTED_SHADOWED_FILE_NAME = 'shadowed-employees-list-file.csv'

const CreateShadowed = () => {
  const [fileName, setFileName] = useState(null)
  const [csvRawData, setCsvRawData] = useState(null)
  const [shadowedFileCsv, setShadowedFileCsv] = useState(null)

  const resetState = () => { 
    setFileName(null)
    setShadowedFileCsv(null)
  }
 
  const convertEmailToHash = (userData) => {
    if (userData.length > 0) {
      
      const result = userData.map((user) => {
        /**
          if user is a user's data 
          where is used for stored an email.
          you must do it like this

          email = user[0]

        // you must checking an email is empty 
        // and you must trim email before encryption to prevent exceed data
        // and prevent hash is about to be wrong
          if(email) {
            encrytedEmail = SHA256(email.trim()).toString()
          }
          
          return encrytedEmail
         

         DON'T access array with out naming
          **/
        const shadowedRow = user
        // what are you doing **********************************************
        shadowedRow[0] = SHA256(user[0]).toString()
   
        // what are you doing **********************************************
        return user
      })
    
      result[0][0] = EMAIL_COLUMN
     
      return result
    }
  }


  const handleDownload = () => {
    const encodedUri = encodeURI(shadowedFileCsv)
    const downloadLink = document.createElement('a')
 
    downloadLink.setAttribute('href', encodedUri)
    downloadLink.setAttribute('download', EXPORTED_SHADOWED_FILE_NAME)
    document.body.appendChild(downloadLink)
    
    link.click()

    // please remove document to prevent web page has many tag a
    // document.delete or something not sure the command, please check
  }


  const convertHashToCsv = (filesArray) => {
    const csvHead = CSV_HEADER_FILE_NAME
    
    let csvContent = ''
   
    filesArray.map((rowArray) => {
      csvContent += `${rowArray.join(',')}\n`
    })
    
    const document = csvHead + csvContent

    setShadowedFileCsv(document)
  }


  const convertCsvFileToShadowedFile = () => {
    if (csvRawData) {
      // you just toll me don't decleard var without meaning but you did it?
      // what is 'ar' means
      const arrayFromCsv = csvRawData.split('\n').map((ar) => ar.split(','))
      const shadowedData = convertEmailToHash(arrayFromCsv)
      convertHashToCsv(shadowedData)
    }
  }

  const readExcel = (file) => { 
    const workBook = XLSX.read(, { type: 'binary' })
    workBook.SheetNames.forEach((sheetName) => {
      const csvUserData = XLSX.utils.make_csv(workBook.Sheets[sheetName])
      setCsvRawData(csvUserData)
    })

  }

  readCSV = (file) => { 

  }

  const getFileFromUpload = (files) => {
    resetState()

    const reader = new FileReader()
    const uploadFileName = files[0].name
    const fileType = uploadFileName.split('.')[1]
    // check file exists?
    setFileName(uploadFileName)
      
    if(fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      reader.readAsBinaryString(files[0])
    }

    if(fileType === 'csv') {
      reader.readAsText(files[0])
    }

    reader.onload = (e) => { 
      if(fileType !== 'csv') {
        readExcel(e.target.result)
      }
      
      setCsvRawData(e.target.result)
    }

    reader.onerror = (e) => {
      // handle message here
    }
  }


  return (
    // don't use <>
    // it don't has meaning
   
    <React.Fragment>
      <div className="header-text ">
        Convert To
        <span className="yellow"> Shadowed </span>
        File
      </div>
      <ReactFileReader handleFiles={getFileFromUpload} fileTypes={['.csv', '.xlsx', '.xls']}>
        <button className="upload-bt" type="button">
          { fileName || (
            <React.Fragment>
              Selected a File
              <div className="upload-icon">+</div>
            </React.Fragment>
          )}
        </button>
      </ReactFileReader>
      {shadowedFileCsv
        ? (
          <button className="convert-bt" onClick={handleDownload} type="button">
            Click To Download
          </button>
        )
        : (
          <button className="convert-bt" onClick={convertCsvFileToShadowedFile} type="button">
            Convert
          </button>
        )}
    </React.Fragment>
  )
}

export default CreateShadowed
