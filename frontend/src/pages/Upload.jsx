import React, { useState } from 'react';
import "./Upload.css";
import { CdsGrid, CdsGridColumn } from '@cds/react/grid';
import { CdsAlert, CdsAlertActions } from '@cds/react/alert';



const Upload = () => {
    const [file, setFile] = useState('');
    const [author, setAuthor] = useState('');
    const [uploadDate, setUploadDate] = useState('');
    const [country, setCountry] = useState('');
    const [category, setCategory] = useState('');

    const handleUpload = () => {
        // Check if any input field is empty
        if (!file || !author || !uploadDate || !country || !category) {
      <CdsAlert
        type="info"
        items={[<CdsAlertActions>Please submit all fields</CdsAlertActions>]}
      />
            return;
        }
    
        // Logic to upload content to the database with the provided tags
        // You can use an API call or any other method to save the data
    
        // Example API call using fetch:
        fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({
                file,
                author,
                uploadDate,
                country,
                category,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                console.log(data);
            })
            .catch(error => {
                // Handle any errors that occurred during the upload
                console.error(error);
            });
    };

    const currentDate = new Date().toISOString().split('T')[0];

    const europeanCountries = [
        'Albania',
        'Andorra',
        'Austria',
        'Belarus',
        'Belgium',
        'Bosnia and Herzegovina',
        'Bulgaria',
        'Croatia',
        'Cyprus',
        'Czech Republic',
        'Denmark',
        'Estonia',
        'Finland',
        'France',
        'Germany',
        'Greece',
        'Hungary',
        'Iceland',
        'Ireland',
        'Italy',
        'Kosovo',
        'Latvia',
        'Liechtenstein',
        'Lithuania',
        'Luxembourg',
        'Malta',
        'Moldova',
        'Monaco',
        'Montenegro',
        'Netherlands',
        'North Macedonia (formerly Macedonia)',
        'Norway',
        'Poland',
        'Portugal',
        'Romania',
        'Russia',
        'San Marino',
        'Serbia',
        'Slovakia',
        'Slovenia',
        'Spain',
        'Sweden',
        'Switzerland',
        'Ukraine',
        'United Kingdom (UK)',
        'Vatican City (Holy See)',
    ];

    return (
        <CdsGrid>
            <CdsGridColumn>
                <form className="clr-form">
                <div className="clr-form-control">
                    <label htmlFor="file">Upload File</label>
                    <input
                        type="file"
                        id="file"
                        value={file}
                        accept="pdf/*, pdf, ppt/*, ppt"
                        onChange={e => setFile(e.target.value)}
                        required  
                        autoFocus
                    />
                </div>
                <div className="clr-form-control">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        placeholder="Author"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="clr-form-control">
                    <label htmlFor="uploadDate">Upload Date</label>
                    <input
                        type="text"
                        id="uploadDate"
                        placeholder="Upload Date"
                        value={currentDate}
                        onChange={e => setUploadDate(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="clr-form-control">
                    <label htmlFor="country">Country</label>
                    <select
                        id="country"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    >
                        <option value="">Select a country</option>
                        {europeanCountries.map(country => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="clr-form-control">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        id="category"
                        placeholder="Category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="clr-form-control">
                    <button className="clr-button" onClick={handleUpload}>
                        Upload
                    </button>
                </div>
                </form>
            </CdsGridColumn>
        </CdsGrid>
    );
};

export default Upload;