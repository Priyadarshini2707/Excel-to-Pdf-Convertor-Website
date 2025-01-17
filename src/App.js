import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState('');
  const [method, setMethod] = useState('html'); // Default method
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSheetNamesChange = (event) => {
    setSheetNames(event.target.value);
  };

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !sheetNames) {
      setError('Please select a file and enter sheet names.');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sheetNames', sheetNames);

    try {
      const response = await axios.post(`http://localhost:5000/convert/${method}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${file.name.split('.')[0]}_${method}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setError('There was an error processing your request.');
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        Excel to PDF
      </header>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="file-label" htmlFor="file-upload">
              Choose file
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".xlsx"
            />
          </div>
          {file && <p className="filename">{file.name}</p>}
          <div className="sheet-names">
            <label>Sheet Names (comma separated):</label>
            <input
              type="text"
              value={sheetNames}
              onChange={handleSheetNamesChange}
            />
          </div>
          <div className="method-selection">
            <label>Conversion Method:</label>
            <select value={method} onChange={handleMethodChange}>
              <option value="html">Method 1 (HTML)</option>
              <option value="win32">Method 2 (Win32)</option>
              <option value="fitz">Method 3 (Fitz)</option>
              <option value="reportlab">Method 4 (ReportLab)</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Converting...' : 'Convert'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default App;
