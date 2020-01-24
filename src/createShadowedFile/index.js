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
  const [csvRawData, setCsvRawData] = useState(null)
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


  const convertCsvFileToShadowedFile = () => {
    const arrayFromCsv = csvRawData.split('\n').map((ar) => ar.split(','))
    const shadowedData = convertEmailToHash(arrayFromCsv)
    convertHashToCsv(shadowedData)
  }

  const getFileFromUpload = (files) => {
    setFileName(null)
    setShadowedFileCsv(null)

    const reader = new FileReader()
    const uploadFileName = files[0].name
    const fileType = uploadFileName.split('.')[1]
    setFileName(uploadFileName)

    if (fileType !== 'csv') {
      reader.onload = (event) => {
        const workBook = XLSX.read(event.target.result, { type: 'binary' })
        workBook.SheetNames.forEach((sheetName) => {
          const csvUserData = XLSX.utils.make_csv(workBook.Sheets[sheetName])
          setCsvRawData(csvUserData)
        })
      }

      reader.readAsBinaryString(files[0])
    } else {
      reader.onload = () => {
        setCsvRawData(reader.result)
      }
      reader.readAsText(files[0])
    }
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
          <button className="convert-bt" onClick={convertCsvFileToShadowedFile} type="button">
            Convert
          </button>
        )}
    </>
  )
}
export default CreateShadowed
