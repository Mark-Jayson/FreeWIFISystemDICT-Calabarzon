// import React from 'react';

// const StatCard = ({ title, value, trend, trendValue, children }) => {
//   const isPositive = trend === 'up';
  
//   return (
//     <div className="bg-white rounded-lg shadow p-4 h-full">
//       <div className="flex flex-col h-full">
//         <div className="text-xs text-gray-600">{title}</div>
//         <div className="text-4xl font-bold mt-2">{value}</div>
        
//         {trendValue && (
//           <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} mt-2`}>
//             <span>{isPositive ? '↑' : '↓'}</span> {trendValue}
//           </div>
//         )}
        
//         {children}
//       </div>
//     </div>
//   );
// };

// export default StatCard;