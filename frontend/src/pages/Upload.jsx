import React, { useEffect, useState } from 'react';
import { CdsButton } from '@cds/react/button';
import { useAuth } from "../Auth/useAuth";

import "@cds/core/button/register.js";
import '@cds/core/input/register.js';
import "@cds/core/icon/register.js"; // Import Clarity Icon component

import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@clr/icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";
import "./Upload.css";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [author, setAuthor] = useState('');
    const [uploadDate, setUploadDate] = useState('');
    const [country, setCountry] = useState('');
    const [category, setCategory] = useState('');

    const { currentUser } = useAuth();
    
    useEffect(() => {
        setUploadDate(new Date().toISOString().split('T')[0]);
    }, []);

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!file || !author || !country || !category) {
            alert("Please submit all fields");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('author', author);
        formData.append('uploadDate', uploadDate);
        formData.append('country', country);
        formData.append('category', category);

        let endpoint = '/api/uploads';
        const fileType = file.name.split('.').pop().toLowerCase();

        if (fileType === 'ppt') {
            endpoint = '/ppt';
        } else if (fileType === 'pptx') {
            endpoint = '/pptx';
        }

        try {

            if (!currentUser) {
                throw new Error('User is not authenticated');
            }

            const token = await currentUser.getIdToken();
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            alert('File uploaded successfully');
        } catch (error) {
            console.error(error);
        }
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
        <div className="Center">
        <form encType='multipart/form-data' className="clr-form" clrLayout="horizontal" onSubmit={handleUpload}>
            <label>Upload File</label>
            <input
                type="file"
                id="file"
                name='file'
                accept="pdf/*, pdf, ppt/*, ppt, pptx/*, pptx"
                onChange={e => setFile(e.target.files[0])}
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

            <label htmlFor="category">Title</label>
            <input
                type="text"
                id="category"
                placeholder="Title"
                value={category}
                onChange={e => setCategory(e.target.value)}
                autoFocus
            />

            <CdsButton className="clr-button" type='submit'>
                Upload
            </CdsButton>
        </form>
        </div>
    );
}

export default Upload;