import React, { useEffect, useState } from 'react';
import useGoogleSheetsModern from '../utils/googlesheet';

const Test = () => {
    const {
    isLoaded,
    isSignedIn,
    error,
    handleSignIn,
    handleSignOut,
    readSheetData,
    writeSheetData,
    appendSheetData,
  } = useGoogleSheetsModern();
    const [sheetData, setSheetData] = useState(null);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchData();
        }
    }, [isLoaded, isSignedIn]);
    const fetchData = async () => {
        setLoading(true);
        
            const data = await readSheetData('Sheet1!A1:D10');
            setSheetData(data);
        
            setLoading(false);
        }
    };


