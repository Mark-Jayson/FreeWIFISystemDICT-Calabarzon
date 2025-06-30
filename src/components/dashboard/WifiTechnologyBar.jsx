// // components/dashboard/WifiTechnologyBar.jsx
// import React from 'react';
// import { Wifi, Router, Signal, Antenna, TrendingUp } from 'lucide-react';

// const WifiTechnologyBar = ({ 
//   data = [], 
//   title = "WiFi Technology Distribution",
//   subtitle = "Technology breakdown across all sites",
//   loading = false,
//   darkMode = false 
// }) => {
//   // Default data if none provided
//   const defaultData = [
//     { name: 'WiFi 6', value: 45, count: 567, color: 'rgba(16, 185, 129, 1)', icon: '📡' },
//     { name: 'WiFi 5', value: 35, count: 441, color: 'rgba(59, 130, 246, 1)', icon: '📶' },
//     { name: 'WiFi 4', value: 15, count: 189, color: 'rgba(245, 158, 11, 1)', icon: '📻' },
//     { name: 'Other', value: 5, count: 63, color: 'rgba(107, 114, 128, 1)', icon: '⚡' }
//   ];

//   const displayData = data.length > 0 ? data : defaultData;
//   const total = displayData.reduce((sum, item) => sum + (item.count || 0), 0);

//   // Icon mapping for different technologies
//   const getIcon = (name) => {
//     const iconMap = {
//       'WiFi 6': Antenna,
//       'WiFi 5': Signal,
//       'WiFi 4': Router,
//       'Other': Wifi,
//       'default': Wifi
//     };
//     return iconMap[name] || iconMap.default;
//   };

//   if (loading) {
//     return (
//       <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
//         rounded-2xl border p-6 transition-all duration-300`}
//         style={{
//           backgroundColor: darkMode ? undefined : 'rgba(255, 255, 255, 1)',
//           borderColor: darkMode ? undefined : 'rgba(236, 237, 242, 1)'
//         }}>
//         <div className="animate-pulse">
//           <div className="h-5 bg-gray-300 rounded w-48 mb-2"></div>
//           <div className="h-3 bg-gray-300 rounded w-32 mb-6"></div>
//           <div className="h-8 bg-gray-300 rounded mb-6"></div>
//           <div className="space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
//                 <div className="flex-1">
//                   <div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
//                   <div className="h-2 bg-gray-300 rounded w-16"></div>
//                 </div>
//                 <div className="h-4 bg-gray-300 rounded w-8"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'} 
//       rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
//       style={{
//         backgroundColor: darkMode ? undefined : 'rgba(255, 255, 255, 1)',
//         borderColor: darkMode ? undefined : 'rgba(236, 237, 242, 1)',
//         fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
//       }}>
    
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex-1 min-w-0">
//           <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-base leading-tight`}>
//             {title}
//           </h3>
//           <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-1 truncate`}>
//             {subtitle}
//           </p>
//         </div>
//         <div className="flex items-center space-x-1 ml-2">
//           <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//           <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-xs font-medium`}>
//             {total.toLocaleString()}
//           </span>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="mb-4">
//         <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-2 rounded-full overflow-hidden flex`}>
//           {displayData.map((item, index) => (
//             <div
//               key={index}
//               className="h-full transition-all duration-1000 ease-out"
//               style={{ 
//                 backgroundColor: item.color,
//                 width: `${item.value}%`
//               }}
//               title={`${item.name}: ${item.value}%`}
//             />
//           ))}
//         </div>
    
//         {/* Percentage Labels */}
//         <div className="flex justify-between mt-1">
//           {displayData.map((item, index) => (
//             <span 
//               key={index} 
//               className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
//               style={{ color: item.color }}
//             >
//               {item.value}%
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Technology List - Compact version */}
//       <div className="space-y-2">
//         {displayData.map((item, index) => {
//           const IconComponent = getIcon(item.name);
//           return (
//             <div key={index} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} 
//               rounded-lg p-2 transition-all duration-200 cursor-pointer group/item`}>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div 
//                     className="p-1.5 rounded-md group-hover/item:scale-110 transition-transform duration-200"
//                     style={{ backgroundColor: `${item.color.replace('1)', '0.2)')}` }}
//                   >
//                     <IconComponent 
//                       className="w-3 h-3" 
//                       style={{ color: item.color }}
//                     />
//                   </div>
//                   <div>
//                     <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium text-xs`}>
//                       {item.name}
//                     </p>
//                     <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
//                       {item.count?.toLocaleString() || 0} sites
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <span 
//                     className="text-sm font-bold"
//                     style={{ color: item.color }}
//                   >
//                     {item.value}%
//                   </span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Summary Footer - Compact */}
//       <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-2 mt-3`}
//         style={{
//           backgroundColor: darkMode ? undefined : 'rgba(239, 246, 255, 1)'
//         }}>
//         <div className="flex items-center justify-between">
//           <div>
//             <p className={`${darkMode ? 'text-white' : 'text-blue-900'} font-semibold text-xs`}>
//               Latest Technology
//             </p>
//             <p className={`${darkMode ? 'text-gray-400' : 'text-blue-700'} text-xs`}>
//               WiFi 6 & WiFi 5 coverage
//             </p>
//           </div>
//           <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>
//             {Math.round((displayData[0]?.value || 0) + (displayData[1]?.value || 0))}%
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WifiTechnologyBar;