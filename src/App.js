import React, { Component } from 'react'
import ReactFileReader from 'react-file-reader'
import './App.css'

const handleFiles = (files) => {
  console.log('files[0]', files[0])
  const reader = new FileReader()
  reader.onload = function (e) {
    console.log(reader.result)
  }
  reader.readAsText(files[0])
}

const App = () => (
  <div className="App">
    <div className="header-text ">
        Convert To
      <span className="shadowed-text"> Shadowed</span>
      File
    </div>
    <ReactFileReader handleFiles={handleFiles} fileTypes={['.csv', '.xlsx']}>
      <button className="upload-bt" type="submit">
          Selected a File
        <div className="upload-icon">+</div>
      </button>
    </ReactFileReader>

    <div className="convert-bt">
          Convert
    </div>

  </div>
)
export default App
