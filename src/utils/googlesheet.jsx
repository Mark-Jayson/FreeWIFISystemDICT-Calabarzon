import { useEffect, useState } from 'react';

// Configuration constants
const API_KEY = 'GOOGLE_API_KEY_REMOVED'; // Optional - if using API key authentication
const CLIENT_ID = '373972642268-m3lvsv8lik9gnq4f14nncuq57cvo8iuh.apps.googleusercontent.com'; // Replace with your OAuth 2.0 Client ID
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const SPREADSHEET_ID = '1OpTl5HKqDY8tW8QJC7qQe1GQQYzX9HJ8HQ0hAr9v9F4'; // Get this from your spreadsheet URL

const useGoogleSheetsModern = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    // Load Google Identity Services
    const loadGIS = async () => {
      try {
        // Load Google API Client script first
        await loadScript('https://apis.google.com/js/api.js');
        
        // Wait for gapi to be available and initialize it
        await new Promise((resolve, reject) => {
          const checkGapi = () => {
            if (window.gapi) {
              window.gapi.load('client', resolve);
            } else {
              // If gapi is not available yet, wait a bit and try again
              setTimeout(checkGapi, 100);
            }
          };
          checkGapi();
          
          // Add a timeout to prevent infinite waiting
          setTimeout(() => reject(new Error('Timeout waiting for gapi')), 10000);
        });

        // Initialize Google API Client
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });

        // Load Google Identity Services script
        await loadScript('https://accounts.google.com/gsi/client');
        
        // Wait for google.accounts to be available
        await new Promise((resolve, reject) => {
          const checkGoogle = () => {
            if (window.google && window.google.accounts) {
              resolve();
            } else {
              setTimeout(checkGoogle, 100);
            }
          };
          checkGoogle();
          
          // Add a timeout to prevent infinite waiting
          setTimeout(() => reject(new Error('Timeout waiting for google.accounts')), 10000);
        });

        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google APIs:', err);
        setError(err);
        setIsLoaded(true);
      }
    };

    loadGIS();
  }, []);

  const handleSignIn = () => {
    return new Promise((resolve, reject) => {
      try {
        if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
          reject(new Error('Google Identity Services not loaded'));
          return;
        }

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              setAccessToken(tokenResponse.access_token);
              // Set the access token for API calls
              window.gapi.client.setToken({
                access_token: tokenResponse.access_token
              });
              resolve(tokenResponse);
            } else {
              reject(new Error('Failed to get access token'));
            }
          },
          error_callback: (error) => {
            console.error('Token client error:', error);
            reject(error);
          }
        });

        tokenClient.requestAccessToken();
      } catch (err) {
        console.error('Error initializing token client:', err);
        reject(err);
      }
    });
  };

  const handleSignOut = () => {
    if (accessToken && window.google && window.google.accounts) {
      window.google.accounts.oauth2.revoke(accessToken, () => {
        setAccessToken(null);
        if (window.gapi && window.gapi.client) {
          window.gapi.client.setToken(null);
        }
      });
    }
  };

  const readSheetData = async (range) => {
    try {
      if (!accessToken) {
        throw new Error('Not authenticated. Please sign in first.');
      }

      if (!window.gapi || !window.gapi.client || !window.gapi.client.sheets) {
        throw new Error('Google Sheets API not loaded');
      }

      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: range, 
      });

      return response.result.values || [];
    } catch (err) {
      console.error('Error reading sheet data:', err);
      throw err;
    }
  };

  const writeSheetData = async (range, values) => {
    try {
      if (!accessToken) {
        throw new Error('Not authenticated. Please sign in first.');
      }

      if (!window.gapi || !window.gapi.client || !window.gapi.client.sheets) {
        throw new Error('Google Sheets API not loaded');
      }

      const response = await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: values,
        },
      });

      return response.result;
    } catch (err) {
      console.error('Error writing sheet data:', err);
      throw err;
    }
  };

  const appendSheetData = async (range, values) => {
    try {
      if (!accessToken) {
        throw new Error('Not authenticated. Please sign in first.');
      }

      if (!window.gapi || !window.gapi.client || !window.gapi.client.sheets) {
        throw new Error('Google Sheets API not loaded');
      }

      const response = await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: values,
        },
      });

      return response.result;
    } catch (err) {
      console.error('Error appending sheet data:', err);
      throw err;
    }
  };

  return {
    isLoaded,
    isSignedIn: !!accessToken,
    error,
    handleSignIn,
    handleSignOut,
    readSheetData,
    writeSheetData,
    appendSheetData,
  };
};

export default useGoogleSheetsModern;