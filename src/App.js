import React, { useState } from 'react'
import * as R from 'ramda'
import SHA256 from 'crypto-js/sha256'
import ReactFileReader from 'react-file-reader'
import './App.css'

const App = () => {
  const [fileName, setFileName] = useState(null)
  const [fileArray, setFileArray] = useState(null)
  const [shadowedFileCsv, setShadowedFileCsv] = useState(null)

  const convertEmailToHash = (emailArrays) => emailArrays.map((emailArray) => {
    const shadowedRow = emailArray
    shadowedRow[0] = SHA256(emailArray[0]).toString()
    return emailArray
  })

  const autoDownload = () => {
    const encodedUri = encodeURI(shadowedFileCsv)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'shadowedFile.csv')
    document.body.appendChild(link)
    link.click()
  }

  const convertHashToCsv = (filesArray) => {
    let csvContent = 'data:text/csv;charset=utf-8,'
    filesArray.map((rowArray) => {
      const row = rowArray.join(',')
      csvContent += `${row}\n`
    })
    setShadowedFileCsv(csvContent)
    // autoDownload(csvContent)
  }

  const getFileFromUpload = (files) => {
    const reader = new FileReader()
    reader.onload = () => {
      const arrayFromCsv = reader.result.split('\n').map((ar) => ar.split(','))
      setFileArray(arrayFromCsv)
      const shadowedData = convertEmailToHash(arrayFromCsv)
      convertHashToCsv(shadowedData)
      setFileName(files[0].name)
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
      <ReactFileReader handleFiles={getFileFromUpload} fileTypes={['.csv', '.xlsx', '.xls']}>
        <button className="upload-bt" type="button">
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
      {shadowedFileCsv
        ? (
          <button className="convert-bt" onClick={autoDownload} type="button">
        Download
          </button>
        )
        : null}
    </div>
  )
}
export default App
