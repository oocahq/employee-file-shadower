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
  const [errorMessage, setErrorMessage] = useState(null)

  const resetState = () => {
    setFileName(null)
    setCsvRawData(null)
    setShadowedFileCsv(null)
    setErrorMessage(null)
  }

  const convertEmailToHash = (userData) => {
    if (userData.length > 0) {
      const result = userData.map((user) => {
        const shadowedRow = user
        shadowedRow[0] = SHA256(user[0]).toString()
        return shadowedRow
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

    downloadLink.click()
  }

  const convertHashToCsv = (filesArray) => {
    let csvContent = CSV_HEADER_FILE_NAME
    filesArray.map((rowArray) => {
      const row = rowArray.join(',')
      csvContent += `${row}\n`
    })
    setShadowedFileCsv(csvContent)
  }

  const convertCsvFileToShadowedFile = () => {
    if (csvRawData) {
      const arrayFromCsv = csvRawData.split('\n').map((eachRow) => eachRow.split(','))
      const shadowedData = convertEmailToHash(arrayFromCsv)
      convertHashToCsv(shadowedData)
    }
  }

  const readExcel = (file) => {
    const workBook = XLSX.read(file, { type: 'binary' })
    workBook.SheetNames.forEach((sheetName) => {
      const csvUserData = XLSX.utils.make_csv(workBook.Sheets[sheetName])
      setCsvRawData(csvUserData)
    })
  }


  const getFileFromUpload = (files) => {
    resetState()
    const reader = new FileReader()
    const uploadFileName = files[0].name
    const fileType = uploadFileName.split('.')[1]
    setFileName(uploadFileName)


    if (fileType !== 'csv') {
      reader.onload = (event) => {
        readExcel(event.target.result)
      }
      reader.readAsBinaryString(files[0])
    } else {
      reader.onload = () => {
        setCsvRawData(reader.result)
      }
      reader.readAsText(files[0])
    }
    reader.onerror = () => {
      setErrorMessage('file upload error')
    }
  }

  return (
    <>
      <div className="header-text ">
        Convert To
        <span className="yellow"> Shadowed </span>
        File
      </div>
      <ReactFileReader
        handleFiles={getFileFromUpload}
        fileTypes={['.csv', '.xlsx', '.xls']}
      >
        <button className="upload-bt" type="button">
          {fileName || (
            <>
              Selected a File
              <div className="upload-icon">+</div>
            </>
          )}
        </button>
      </ReactFileReader>


      {shadowedFileCsv ? (
        <button className="convert-bt" onClick={handleDownload} type="button">
          Click To Download
        </button>
      ) : (
        <button
          className="convert-bt"
          onClick={convertCsvFileToShadowedFile}
          type="button"
        >
          Convert
        </button>
      )}
      <div className="error-message">
        {errorMessage}
      </div>
    </>
  )
}
export default CreateShadowed
