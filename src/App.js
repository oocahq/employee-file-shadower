import React, { useState } from 'react'
import * as R from 'ramda'
import SHA256 from 'crypto-js/sha256'
import ReactFileReader from 'react-file-reader'
import './App.css'

console.log('hash', SHA256('eao').toString())
const App = () => {
  const [fileName, setFileName] = useState(null)
  const [fileArray, setFileArray] = useState(null)

  const convertEmailToHash = (emailArrays) => emailArrays.map((emailArray) => {
    const shadowedRow = emailArray
    shadowedRow[0] = SHA256(emailArray[0]).toString()
    return emailArray
  })

  const handleFiles = (files) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayFromCsv = reader.result.split('\n').map((ar) => ar.split(','))
      setFileArray(arrayFromCsv)
      console.log('convertEmailToHash', convertEmailToHash(arrayFromCsv))
      const { name } = files[0]
      setFileName(name)
    }
    reader.readAsText(files[0])
  }


  return (
    <div className="App">
      <div className="header-text ">
        Convert To
        <span className="yellow"> Shadowed </span>
        File
      </div>
      <ReactFileReader handleFiles={handleFiles} fileTypes={['.csv', '.xlsx', '.xls']}>
        <button className="upload-bt" type="submit">
          { fileName || (
            <>
              Selected a File
              <div className="upload-icon">+</div>
            </>
          )}
        </button>
      </ReactFileReader>
      <div className="convert-bt">
          Convert
      </div>
    </div>
  )
}
export default App
