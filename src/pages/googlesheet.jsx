import React, { useState, useEffect, useRef } from 'react';

const GoogleSheet = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sheetId = '1gk0v2x4X3J5Q6G7Z5F8Y5F8Y5F8Y5F8Y5F8Y5F8Y5F8';
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const sheetName = 'Sheet1'; // Replace with your actual sheet name
    
    useEffect(() => {
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`)
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setData(data.values);
            setLoading(false);
        })
        .catch((error) => {
            setError(error);
            setLoading(false);
        });
    }, [sheetId, apiKey, sheetName]);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
        if (error) {
            return <div>Error: {error.message}</div>;
        }
    
        return (
            <div>
                <h2>Google Sheet Data</h2>
                <table>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }