import React, { useState } from 'react';

// RGB color overrides for Tailwind's OKLCH colors
const colorOverrides = `
  :root {
    --tw-color-slate-50: 248 250 252;
    --tw-color-slate-100: 241 245 249;
    --tw-color-slate-200: 226 232 240;
    --tw-color-slate-300: 203 213 225;
    --tw-color-slate-400: 148 163 184;
    --tw-color-slate-500: 100 116 139;
    --tw-color-slate-600: 71 85 105;
    --tw-color-slate-700: 51 65 85;
    --tw-color-slate-800: 30 41 59;
    --tw-color-slate-900: 15 23 42;
    --tw-color-slate-950: 2 6 23;
    
    --tw-color-gray-50: 249 250 251;
    --tw-color-gray-100: 243 244 246;
    --tw-color-gray-200: 229 231 235;
    --tw-color-gray-300: 209 213 219;
    --tw-color-gray-400: 156 163 175;
    --tw-color-gray-500: 107 114 128;
    --tw-color-gray-600: 75 85 99;
    --tw-color-gray-700: 55 65 81;
    --tw-color-gray-800: 31 41 55;
    --tw-color-gray-900: 17 24 39;
    --tw-color-gray-950: 3 7 18;
    
    --tw-color-zinc-50: 250 250 250;
    --tw-color-zinc-100: 244 244 245;
    --tw-color-zinc-200: 228 228 231;
    --tw-color-zinc-300: 212 212 216;
    --tw-color-zinc-400: 161 161 170;
    --tw-color-zinc-500: 113 113 122;
    --tw-color-zinc-600: 82 82 91;
    --tw-color-zinc-700: 63 63 70;
    --tw-color-zinc-800: 39 39 42;
    --tw-color-zinc-900: 24 24 27;
    --tw-color-zinc-950: 9 9 11;
    
    --tw-color-neutral-50: 250 250 250;
    --tw-color-neutral-100: 245 245 245;
    --tw-color-neutral-200: 229 229 229;
    --tw-color-neutral-300: 212 212 212;
    --tw-color-neutral-400: 163 163 163;
    --tw-color-neutral-500: 115 115 115;
    --tw-color-neutral-600: 82 82 82;
    --tw-color-neutral-700: 64 64 64;
    --tw-color-neutral-800: 38 38 38;
    --tw-color-neutral-900: 23 23 23;
    --tw-color-neutral-950: 10 10 10;
    
    --tw-color-stone-50: 250 250 249;
    --tw-color-stone-100: 245 245 244;
    --tw-color-stone-200: 231 229 228;
    --tw-color-stone-300: 214 211 209;
    --tw-color-stone-400: 168 162 158;
    --tw-color-stone-500: 120 113 108;
    --tw-color-stone-600: 87 83 78;
    --tw-color-stone-700: 68 64 60;
    --tw-color-stone-800: 41 37 36;
    --tw-color-stone-900: 28 25 23;
    --tw-color-stone-950: 12 10 9;
    
    --tw-color-red-50: 254 242 242;
    --tw-color-red-100: 254 226 226;
    --tw-color-red-200: 254 202 202;
    --tw-color-red-300: 252 165 165;
    --tw-color-red-400: 248 113 113;
    --tw-color-red-500: 239 68 68;
    --tw-color-red-600: 220 38 38;
    --tw-color-red-700: 185 28 28;
    --tw-color-red-800: 153 27 27;
    --tw-color-red-900: 127 29 29;
    --tw-color-red-950: 69 10 10;
    
    --tw-color-orange-50: 255 247 237;
    --tw-color-orange-100: 255 237 213;
    --tw-color-orange-200: 254 215 170;
    --tw-color-orange-300: 253 186 116;
    --tw-color-orange-400: 251 146 60;
    --tw-color-orange-500: 249 115 22;
    --tw-color-orange-600: 234 88 12;
    --tw-color-orange-700: 194 65 12;
    --tw-color-orange-800: 154 52 18;
    --tw-color-orange-900: 124 45 18;
    --tw-color-orange-950: 67 20 7;
    
    --tw-color-amber-50: 255 251 235;
    --tw-color-amber-100: 254 243 199;
    --tw-color-amber-200: 253 230 138;
    --tw-color-amber-300: 252 211 77;
    --tw-color-amber-400: 251 191 36;
    --tw-color-amber-500: 245 158 11;
    --tw-color-amber-600: 217 119 6;
    --tw-color-amber-700: 180 83 9;
    --tw-color-amber-800: 146 64 14;
    --tw-color-amber-900: 120 53 15;
    --tw-color-amber-950: 69 26 3;
    
    --tw-color-yellow-50: 254 252 232;
    --tw-color-yellow-100: 254 249 195;
    --tw-color-yellow-200: 254 240 138;
    --tw-color-yellow-300: 253 224 71;
    --tw-color-yellow-400: 250 204 21;
    --tw-color-yellow-500: 234 179 8;
    --tw-color-yellow-600: 202 138 4;
    --tw-color-yellow-700: 161 98 7;
    --tw-color-yellow-800: 133 77 14;
    --tw-color-yellow-900: 113 63 18;
    --tw-color-yellow-950: 66 32 6;
    
    --tw-color-lime-50: 247 254 231;
    --tw-color-lime-100: 236 252 203;
    --tw-color-lime-200: 217 249 157;
    --tw-color-lime-300: 190 242 100;
    --tw-color-lime-400: 163 230 53;
    --tw-color-lime-500: 132 204 22;
    --tw-color-lime-600: 101 163 13;
    --tw-color-lime-700: 77 124 15;
    --tw-color-lime-800: 63 98 18;
    --tw-color-lime-900: 54 83 20;
    --tw-color-lime-950: 26 46 5;
    
    --tw-color-green-50: 240 253 244;
    --tw-color-green-100: 220 252 231;
    --tw-color-green-200: 187 247 208;
    --tw-color-green-300: 134 239 172;
    --tw-color-green-400: 74 222 128;
    --tw-color-green-500: 34 197 94;
    --tw-color-green-600: 22 163 74;
    --tw-color-green-700: 21 128 61;
    --tw-color-green-800: 22 101 52;
    --tw-color-green-900: 20 83 45;
    --tw-color-green-950: 5 46 22;
    
    --tw-color-emerald-50: 236 253 245;
    --tw-color-emerald-100: 209 250 229;
    --tw-color-emerald-200: 167 243 208;
    --tw-color-emerald-300: 110 231 183;
    --tw-color-emerald-400: 52 211 153;
    --tw-color-emerald-500: 16 185 129;
    --tw-color-emerald-600: 5 150 105;
    --tw-color-emerald-700: 4 120 87;
    --tw-color-emerald-800: 6 95 70;
    --tw-color-emerald-900: 6 78 59;
    --tw-color-emerald-950: 2 44 34;
    
    --tw-color-teal-50: 240 253 250;
    --tw-color-teal-100: 204 251 241;
    --tw-color-teal-200: 153 246 228;
    --tw-color-teal-300: 94 234 212;
    --tw-color-teal-400: 45 212 191;
    --tw-color-teal-500: 20 184 166;
    --tw-color-teal-600: 13 148 136;
    --tw-color-teal-700: 15 118 110;
    --tw-color-teal-800: 17 94 89;
    --tw-color-teal-900: 19 78 74;
    --tw-color-teal-950: 4 47 46;
    
    --tw-color-cyan-50: 236 254 255;
    --tw-color-cyan-100: 207 250 254;
    --tw-color-cyan-200: 165 243 252;
    --tw-color-cyan-300: 103 232 249;
    --tw-color-cyan-400: 34 211 238;
    --tw-color-cyan-500: 6 182 212;
    --tw-color-cyan-600: 8 145 178;
    --tw-color-cyan-700: 14 116 144;
    --tw-color-cyan-800: 21 94 117;
    --tw-color-cyan-900: 22 78 99;
    --tw-color-cyan-950: 8 51 68;
    
    --tw-color-sky-50: 240 249 255;
    --tw-color-sky-100: 224 242 254;
    --tw-color-sky-200: 186 230 253;
    --tw-color-sky-300: 125 211 252;
    --tw-color-sky-400: 56 189 248;
    --tw-color-sky-500: 14 165 233;
    --tw-color-sky-600: 2 132 199;
    --tw-color-sky-700: 3 105 161;
    --tw-color-sky-800: 7 89 133;
    --tw-color-sky-900: 12 74 110;
    --tw-color-sky-950: 8 47 73;
    
    --tw-color-blue-50: 239 246 255;
    --tw-color-blue-100: 219 234 254;
    --tw-color-blue-200: 191 219 254;
    --tw-color-blue-300: 147 197 253;
    --tw-color-blue-400: 96 165 250;
    --tw-color-blue-500: 59 130 246;
    --tw-color-blue-600: 37 99 235;
    --tw-color-blue-700: 29 78 216;
    --tw-color-blue-800: 30 64 175;
    --tw-color-blue-900: 30 58 138;
    --tw-color-blue-950: 23 37 84;
    
    --tw-color-indigo-50: 238 242 255;
    --tw-color-indigo-100: 224 231 255;
    --tw-color-indigo-200: 199 210 254;
    --tw-color-indigo-300: 165 180 252;
    --tw-color-indigo-400: 129 140 248;
    --tw-color-indigo-500: 99 102 241;
    --tw-color-indigo-600: 79 70 229;
    --tw-color-indigo-700: 67 56 202;
    --tw-color-indigo-800: 55 48 163;
    --tw-color-indigo-900: 49 46 129;
    --tw-color-indigo-950: 30 27 75;
    
    --tw-color-violet-50: 245 243 255;
    --tw-color-violet-100: 237 233 254;
    --tw-color-violet-200: 221 214 254;
    --tw-color-violet-300: 196 181 253;
    --tw-color-violet-400: 167 139 250;
    --tw-color-violet-500: 139 92 246;
    --tw-color-violet-600: 124 58 237;
    --tw-color-violet-700: 109 40 217;
    --tw-color-violet-800: 91 33 182;
    --tw-color-violet-900: 76 29 149;
    --tw-color-violet-950: 46 16 101;
    
    --tw-color-purple-50: 250 245 255;
    --tw-color-purple-100: 243 232 255;
    --tw-color-purple-200: 233 213 255;
    --tw-color-purple-300: 216 180 254;
    --tw-color-purple-400: 196 181 253;
    --tw-color-purple-500: 168 85 247;
    --tw-color-purple-600: 147 51 234;
    --tw-color-purple-700: 126 34 206;
    --tw-color-purple-800: 107 33 168;
    --tw-color-purple-900: 88 28 135;
    --tw-color-purple-950: 59 7 100;
    
    --tw-color-fuchsia-50: 253 244 255;
    --tw-color-fuchsia-100: 250 232 255;
    --tw-color-fuchsia-200: 245 208 254;
    --tw-color-fuchsia-300: 240 171 252;
    --tw-color-fuchsia-400: 232 121 249;
    --tw-color-fuchsia-500: 217 70 239;
    --tw-color-fuchsia-600: 192 38 211;
    --tw-color-fuchsia-700: 162 28 175;
    --tw-color-fuchsia-800: 134 25 143;
    --tw-color-fuchsia-900: 112 26 117;
    --tw-color-fuchsia-950: 74 4 78;
    
    --tw-color-pink-50: 253 242 248;
    --tw-color-pink-100: 252 231 243;
    --tw-color-pink-200: 251 207 232;
    --tw-color-pink-300: 249 168 212;
    --tw-color-pink-400: 244 114 182;
    --tw-color-pink-500: 236 72 153;
    --tw-color-pink-600: 219 39 119;
    --tw-color-pink-700: 190 24 93;
    --tw-color-pink-800: 157 23 77;
    --tw-color-pink-900: 131 24 67;
    --tw-color-pink-950: 80 7 36;
    
    --tw-color-rose-50: 255 241 242;
    --tw-color-rose-100: 255 228 230;
    --tw-color-rose-200: 254 205 211;
    --tw-color-rose-300: 253 164 175;
    --tw-color-rose-400: 251 113 133;
    --tw-color-rose-500: 244 63 94;
    --tw-color-rose-600: 225 29 72;
    --tw-color-rose-700: 190 18 60;
    --tw-color-rose-800: 159 18 57;
    --tw-color-rose-900: 136 19 55;
    --tw-color-rose-950: 76 5 25;
  }
  
  * {
    --tw-bg-opacity: 1;
    --tw-text-opacity: 1;
    --tw-border-opacity: 1;
    --tw-ring-opacity: 1;
  }
`;

// Main App component
const App = () => {
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
    <>
      <style dangerouslySetInnerHTML={{ __html: colorOverrides }} />
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
    </>
  );
};

export default App;