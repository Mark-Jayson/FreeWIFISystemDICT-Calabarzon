import React, { useState } from 'react';


const Coordinate = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateCoordinates = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/update-location-coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Update completed! Total processed: ${data.totalProcessed}. Updated: ${data.updatedCount}. New coordinates added: ${data.newCoordinatesAdded}.`);
        if (data.errors && data.errors.length > 0) {
          setError('Some locations had issues: ' + data.errors.join('; '));
        }
      } else {
        setError(data.error || 'Failed to update coordinates.');
      }
    } catch (err) {
      console.error('Error fetching from API:', err);
      setError('Network error or server is unreachable. Please check the server console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Location Coordinate Updater</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to update or add latitude and longitude for your locations
          based on Mapbox Geocoding data. Coordinates will only be changed if they are blank or
          differ by more than 5km from Mapbox's suggestions.
        </p>
        <button
          onClick={handleUpdateCoordinates}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-all duration-300 ${
            loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          }`}
        >
          {loading ? 'Updating Coordinates...' : 'Update Location Coordinates'}
        </button>

        {loading && (
          <div className="mt-4 text-blue-500 font-medium">
            Please wait, this might take a while depending on the number of locations...
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coordinate;
