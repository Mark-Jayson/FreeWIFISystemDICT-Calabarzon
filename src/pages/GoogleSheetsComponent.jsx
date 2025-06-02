// /// App.js or your component file
// import React, { useState, useEffect } from 'react';
// import useGoogleSheetsModern from './googlesheet';

// const GoogleSheetsComponent=() =>{
//   const {
//     isLoaded,
//     isSignedIn,
//     error,
//     handleSignIn,
//     handleSignOut,
//     readSheetData,
//     writeSheetData,
//     appendSheetData,
//   } = useGoogleSheetsModern();

//   const [sheetData, setSheetData] = useState([]);
//   const [newRow, setNewRow] = useState(['', '', '']); 
//   const [loading, setLoading] = useState(false);

//   // Column headers for better display
//   const columnHeaders = [
//     'Column A', 'Column B', 'Column C', 'Column D', 'Column E',
//     'Column F', 'Column G', 'Column H', 'Column I', 'Column J',
//     'Column K', 'Column L', 'Column M', 'Column N', 'Column O',
//     'Column P', 'Column Q', 'Column R', 'Column S', 'Column T',
//     'Column U', 'Column V', 'Column W', 'Column X', 'Column Y'
//   ];

//   // Load data when user signs in
//   useEffect(() => {
//     if (isSignedIn) {
//       fetchData();
//     }
//   }, [isSignedIn]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await readSheetData('Sheet1!A4:Y3723');
//       setSheetData(data || []);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleWrite = async () => {
//     setLoading(true);
//     try {
//       await writeSheetData('Sheet1!A2:Y2', [['Updated', 'Data', 'Row']]);
//       fetchData();
//     } catch (err) {
//       console.error('Error writing data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAppend = async () => {
//     setLoading(true);
//     try {
//       await appendSheetData('Sheet1!A:Y', [newRow]);
//       setNewRow(['', '', '']);
//       fetchData();
//     } catch (err) {
//       console.error('Error appending data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (index, value) => {
//     const updatedRow = [...newRow];
//     updatedRow[index] = value;
//     setNewRow(updatedRow);
//   };

//   if (!isLoaded) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 text-lg">Loading Google Sheets API...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">Error</h3>
//               <p className="text-sm text-red-700 mt-1">{error.message}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white shadow rounded-lg p-6 mb-8">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold text-gray-900">Google Sheets Integration</h1>
//             {!isSignedIn ? (
//               <button 
//                 onClick={handleSignIn}
//                 className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//               >
//                 <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//                 </svg>
//                 Sign In with Google
//               </button>
//             ) : (
//               <div className="flex space-x-4">
//                 <button 
//                   onClick={fetchData}
//                   disabled={loading}
//                   className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                 >
//                   {loading ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
//                   ) : (
//                     <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                   )}
//                   Refresh Data
//                 </button>
//                 <button 
//                   onClick={handleSignOut}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                   </svg>
//                   Sign Out
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {isSignedIn && (
//           <>
//             {/* Actions Section */}
//             <div className="bg-white shadow rounded-lg p-6 mb-8">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Update Row Section */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Update Row 2</h3>
//                   <button 
//                     onClick={handleWrite}
//                     disabled={loading}
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                   >
//                     {loading ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     ) : (
//                       <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                     )}
//                     Update Row 2
//                   </button>
//                 </div>

//                 {/* Add New Row Section */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Row</h3>
//                   <div className="space-y-3">
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                       <input
//                         type="text"
//                         value={newRow[0]}
//                         onChange={(e) => handleInputChange(0, e.target.value)}
//                         placeholder="Column A"
//                         className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       />
//                       <input
//                         type="text"
//                         value={newRow[1]}
//                         onChange={(e) => handleInputChange(1, e.target.value)}
//                         placeholder="Column B"
//                         className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       />
//                       <input
//                         type="text"
//                         value={newRow[2]}
//                         onChange={(e) => handleInputChange(2, e.target.value)}
//                         placeholder="Column C"
//                         className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <button 
//                       onClick={handleAppend}
//                       disabled={loading || newRow.every(val => val === '')}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                     >
//                       {loading ? (
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       ) : (
//                         <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                       )}
//                       Add Row
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Data Table Section */}
//             <div className="bg-white shadow rounded-lg overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900">Sheet Data</h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {sheetData.length} rows of data
//                 </p>
//               </div>
              
//               {loading ? (
//                 <div className="p-8 text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-4 text-gray-600">Loading data...</p>
//                 </div>
//               ) : sheetData.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         {columnHeaders.map((header, index) => (
//                           <th
//                             key={index}
//                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                             {header}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {sheetData.map((row, rowIndex) => (
//                         <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
//                           {columnHeaders.map((_, cellIndex) => (
//                             <td
//                               key={cellIndex}
//                               className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
//                             >
//                               {row[cellIndex] || '-'}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="p-8 text-center">
//                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     The spreadsheet appears to be empty or the range contains no data.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default GoogleSheetsComponent;