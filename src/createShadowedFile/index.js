import React, { useState } from 'react'
import * as R from 'ramda'
import ReactFileReader from 'react-file-reader'
import SHA256 from 'crypto-js/sha256'
import './createShadowedFile.css'

const CreateShadowed = () => {
  const [fileName, setFileName] = useState(null)
  const [shadowedFileCsv, setShadowedFileCsv] = useState(null)

  const convertEmailToHash = (userData) => {
    const result = userData.map((user) => {
      const shadowedRow = user
      shadowedRow[0] = SHA256(user[0]).toString()
      return user
    })
    result[0][0] = 'email'
    return result
  }


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
  }

  const getFileFromUpload = (files) => {
    const reader = new FileReader()
    reader.onload = () => {
      const arrayFromCsv = reader.result.split('\n').map((ar) => ar.split(','))
      const shadowedData = convertEmailToHash(arrayFromCsv)
      console.log('shadowedDAta', shadowedData)
      convertHashToCsv(shadowedData)
      setFileName(files[0].name)
    }
    reader.readAsText(files[0])
  }


  return (
    < >
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

      {shadowedFileCsv
        ? (
          <button className="convert-bt" onClick={autoDownload} type="button">
            Click To Download
          </button>
        )
        : (
          <div className="convert-bt">
            Convert
          </div>
        )}
    </>
  )
}
export default CreateShadowed
