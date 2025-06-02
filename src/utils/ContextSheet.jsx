// SheetsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import useGoogleSheetsModern from './googlesheet';

// Create the context
const SheetsContext = createContext();

// Custom hook to use the context
export const useSheets = () => {
  const context = useContext(SheetsContext);
  if (!context) {
    throw new Error('useSheets must be used within a SheetsProvider');
  }
  return context;
};

// Provider component
export const SheetsProvider = ({ children }) => {
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

  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data when user signs in
  useEffect(() => {
    if (isSignedIn) {
      fetchData();
    }
  }, [isSignedIn]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await readSheetData('Sheet1!A4:Y3723');
      setSheetData(data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWrite = async () => {
    setLoading(true);
    try {
      await writeSheetData('Sheet1!A2:Y2', [['Updated', 'Data', 'Row']]);
      await fetchData(); // Refresh data after update
    } catch (err) {
      console.error('Error writing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppend = async (newRow) => {
    setLoading(true);
    try {
      await appendSheetData('Sheet1!A:Y', [newRow]);
      await fetchData(); // Refresh data after append
    } catch (err) {
      console.error('Error appending data:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // Google Sheets state
    isLoaded,
    isSignedIn,
    error,
    handleSignIn,
    handleSignOut,
    
    // Sheet data state
    sheetData,
    loading,
    
    // Actions
    fetchData,
    handleWrite,
    handleAppend,
    
    // Raw Google Sheets functions for custom operations
    readSheetData,
    writeSheetData,
    appendSheetData,
  };

  return (
    <SheetsContext.Provider value={value}>
      {children}
    </SheetsContext.Provider>
  );
};