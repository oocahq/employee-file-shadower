import React, { useState } from 'react'
import * as R from 'ramda'
import XLSX from 'xlsx'
import ReactFileReader from 'react-file-reader'
import SHA256 from 'crypto-js/sha256'
import './createShadowedFile.css'

const FIRST_COLUMN_NAME = 'email'
const CSV_HEADER_FILE_NAME = 'data:text/csv;charset=utf-8,'
const EXPORTED_SHADOWED_FILE_NAME = 'shadowed-file.csv'

const CreateShadowed = () => {
  const [fileName, setFileName] = useState(null)
  const [shadowedFileCsv, setShadowedFileCsv] = useState(null)

  const convertEmailToHash = (userData) => {
    if (userData.length > 0) {
      const result = userData.map((user) => {
        const shadowedRow = user
        shadowedRow[0] = SHA256(user[0]).toString()
        return user
      })
      result[0][0] = FIRST_COLUMN_NAME
      return result
    }
  }


  const autoDownload = () => {
    const encodedUri = encodeURI(shadowedFileCsv)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', EXPORTED_SHADOWED_FILE_NAME)
    document.body.appendChild(link)
    link.click()
  }


  const convertHashToCsv = (filesArray) => {
    let csvContent = CSV_HEADER_FILE_NAME
    filesArray.map((rowArray) => {
      const row = rowArray.join(',')
      csvContent += `${row}\n`
    })
    setShadowedFileCsv(csvContent)
  }


  const convertCsvFileToShadowedFile = (csvUserData) => {
    const arrayFromCsv = csvUserData.split('\n').map((ar) => ar.split(','))
    const shadowedData = convertEmailToHash(arrayFromCsv)
    convertHashToCsv(shadowedData)
  }

  const getFileFromUpload = (files) => {
    const reader = new FileReader()

    // reader.onload = () => {
    //   const arrayFromCsv = reader.result.split('\n').map((ar) => ar.split(','))
    //   const shadowedData = convertEmailToHash(arrayFromCsv)
    //   console.log('shadowedDAta', shadowedData)
    //   convertHashToCsv(shadowedData)
    //   setFileName(files[0].name)
    // }
    // reader.readAsText(files[0])


    reader.onload = (event) => {
      const data = event.target.result
      const workBook = XLSX.read(data, { type: 'binary' })
      setFileName(files[0].name)
      workBook.SheetNames.map((sheetName) => {
        const csvUserData = XLSX.utils.make_csv(workBook.Sheets[sheetName])
        convertCsvFileToShadowedFile(csvUserData)
      })
    }

    reader.readAsBinaryString(files[0])
    console.log('selectedFile', files[0])
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
