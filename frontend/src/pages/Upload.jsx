import React, { useState } from 'react';
import "./Upload.css";

const Upload = () => {
    const [file, setFile] = useState('');
    const [author, setAuthor] = useState('');
    const [uploadDate, setUploadDate] = useState('');
    const [country, setCountry] = useState('');
    const [category, setCategory] = useState('');

    const handleUpload = (event) => {
        event.preventDefault();
        // Check if any input field is empty
        if (!file || !author || !country || !category) {
            alert("Please submit all fields");
            return;
        }

        // Logic to upload content to the database with the provided tags
        // You can use an API call or any other method to save the data

        // Create a new FormData instance
        let formData = new FormData();

        // Append the file and other data to the FormData instance
        formData.append('file', file);
        formData.append('author', author);
        formData.append('uploadDate', uploadDate);
        formData.append('country', country);
        formData.append('category', category);

        // Send the FormData instance to the server
        fetch('http://localhost:8000/api/uploads', {
            method: 'POST',
            body: formData,
            JSON : true
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
        <form className="clr-form" clrlayout="horizontal">
            <label>Upload File</label>
            <input
                type="file"
                id="file"
                accept="pdf/*, pdf, ppt/*, ppt"
                onChange={e => setFile(e.target.files[0])}
                required
                autoFocus
            />

            <label htmlFor="author">Author</label>
            <input
                type="text"
                id="author"
                placeholder="Author"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                autoFocus
            />

            <label htmlFor="uploadDate">Upload Date</label>
            <input
                type="text"
                id="uploadDate"
                placeholder="Upload Date"
                value={currentDate}
                onChange={e => setUploadDate(e.target.value)}
                autoFocus
            />

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

            <label htmlFor="category">Category</label>
            <input
                type="text"
                id="category"
                placeholder="Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                autoFocus
            />

            <button className="clr-button" onClick={handleUpload}>
                Upload
            </button>
        </form>
    );
}

export default Upload;
