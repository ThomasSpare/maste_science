import React, { useEffect, useState } from 'react';
import "./Upload.css";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [author, setAuthor] = useState('');
    const [uploadDate, setUploadDate] = useState('');
    const [country, setCountry] = useState('');
    const [category, setCategory] = useState('');
    
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

        try {
            const response = await fetch('http://localhost:8000/api/uploads', {
                method: 'POST',
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
        <form encType='multipart/form-data' className="clr-form" clrlayout="horizontal" onSubmit={handleUpload}>
            <label>Upload File</label>
            <input
                type="file"
                id="file"
                name='file'
                accept="pdf/*, pdf, ppt/*, ppt"
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

            <label htmlFor="category">Category</label>
            <input
                type="text"
                id="category"
                placeholder="Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                autoFocus
            />

            <button className="clr-button" type='submit'>
                Upload
            </button>
        </form>
    );
}

export default Upload;