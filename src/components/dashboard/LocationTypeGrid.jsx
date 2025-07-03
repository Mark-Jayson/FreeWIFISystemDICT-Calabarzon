import React, { useState } from 'react';

const getIconForSiteType = (type) => {
  const lower = (type || '').toLowerCase();

  if (lower.includes('school') || lower.includes('pes') || lower.includes('phs')) return '🏫';
  if (lower.includes('lgu') || lower.includes('local government') || lower.includes('nga') || lower.includes('drrmo')) return '🏛️';
  if (lower.includes('hsp')) return '🏥';
  if (lower.includes('fire')) return '🔥';
  if (lower.includes('police')) return '👮';
  if (lower.includes('market') || lower.includes('mkt') || lower.includes('*pm')) return '🛒';
  if (lower.includes('library') || lower.includes('lib')) return '📚';
  if (lower.includes('barangay') || lower.includes('bgy') || lower.includes('lgu-brgy')) return '🏘️';
  if (lower.includes('plaza') || lower.includes('plz')) return '🏘️';
  if (lower.includes('office')) return '🏢';
  if (lower.includes('terminal')) return '🚌';
  if (lower.includes('tourism')) return '🌴';
  if (lower.includes('rural health') || lower.includes('rhu') || lower.includes('brgy health station') || lower.includes('cqf')) return '🩺';
  if (lower.includes('suc') || lower.includes('college')) return '🎓';
  if (lower.includes('sea')) return '🚢';
  if (lower.includes('land')) return '🚗';
  if (lower.includes('field office') || lower.includes('fo')) return '🏢';

  return '📍';
};

// RGB color overrides for Tailwind's OKLCH colors
const rgbColors = {
  // White
  white: 'rgb(255, 255, 255)',
  
  // Black
  black: 'rgb(0, 0, 0)',
  
  // Gray scale
  gray: {
    50: 'rgb(249, 250, 251)',
    100: 'rgb(243, 244, 246)',
    200: 'rgb(229, 231, 235)',
    300: 'rgb(209, 213, 219)',
    400: 'rgb(156, 163, 175)',
    500: 'rgb(107, 114, 128)',
    600: 'rgb(75, 85, 99)',
    700: 'rgb(55, 65, 81)',
    800: 'rgb(31, 41, 55)',
    900: 'rgb(17, 24, 39)',
    950: 'rgb(3, 7, 18)',
  },
  
  // Blue scale
  blue: {
    50: 'rgb(239, 246, 255)',
    100: 'rgb(219, 234, 254)',
    200: 'rgb(191, 219, 254)',
    300: 'rgb(147, 197, 253)',
    400: 'rgb(96, 165, 250)',
    500: 'rgb(59, 130, 246)',
    600: 'rgb(37, 99, 235)',
    700: 'rgb(29, 78, 216)',
    800: 'rgb(30, 64, 175)',
    900: 'rgb(30, 58, 138)',
    950: 'rgb(23, 37, 84)',
  },
  
  // Red scale
  red: {
    50: 'rgb(254, 242, 242)',
    100: 'rgb(254, 226, 226)',
    200: 'rgb(254, 202, 202)',
    300: 'rgb(252, 165, 165)',
    400: 'rgb(248, 113, 113)',
    500: 'rgb(239, 68, 68)',
    600: 'rgb(220, 38, 38)',
    700: 'rgb(185, 28, 28)',
    800: 'rgb(153, 27, 27)',
    900: 'rgb(127, 29, 29)',
    950: 'rgb(69, 10, 10)',
  },
  
  // Green scale
  green: {
    50: 'rgb(240, 253, 244)',
    100: 'rgb(220, 252, 231)',
    200: 'rgb(187, 247, 208)',
    300: 'rgb(134, 239, 172)',
    400: 'rgb(74, 222, 128)',
    500: 'rgb(34, 197, 94)',
    600: 'rgb(22, 163, 74)',
    700: 'rgb(21, 128, 61)',
    800: 'rgb(22, 101, 52)',
    900: 'rgb(20, 83, 45)',
    950: 'rgb(5, 46, 22)',
  },
  
  // Yellow scale
  yellow: {
    50: 'rgb(254, 252, 232)',
    100: 'rgb(254, 249, 195)',
    200: 'rgb(254, 240, 138)',
    300: 'rgb(253, 224, 71)',
    400: 'rgb(250, 204, 21)',
    500: 'rgb(234, 179, 8)',
    600: 'rgb(202, 138, 4)',
    700: 'rgb(161, 98, 7)',
    800: 'rgb(133, 77, 14)',
    900: 'rgb(113, 63, 18)',
    950: 'rgb(66, 32, 6)',
  },
  
  // Purple scale
  purple: {
    50: 'rgb(250, 245, 255)',
    100: 'rgb(243, 232, 255)',
    200: 'rgb(233, 213, 255)',
    300: 'rgb(196, 181, 253)',
    400: 'rgb(167, 139, 250)',
    500: 'rgb(139, 92, 246)',
    600: 'rgb(124, 58, 237)',
    700: 'rgb(109, 40, 217)',
    800: 'rgb(91, 33, 182)',
    900: 'rgb(76, 29, 149)',
    950: 'rgb(46, 16, 101)',
  },
  
  // Indigo scale
  indigo: {
    50: 'rgb(238, 242, 255)',
    100: 'rgb(224, 231, 255)',
    200: 'rgb(199, 210, 254)',
    300: 'rgb(165, 180, 252)',
    400: 'rgb(129, 140, 248)',
    500: 'rgb(99, 102, 241)',
    600: 'rgb(79, 70, 229)',
    700: 'rgb(67, 56, 202)',
    800: 'rgb(55, 48, 163)',
    900: 'rgb(49, 46, 129)',
    950: 'rgb(30, 27, 75)',
  },
  
  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.25)',
    dark: 'rgba(0, 0, 0, 0.5)',
  }
};

const ITEMS_PER_PAGE = 6;

const LocationTypeGrid = ({ title, subtitle, data }) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const pageData = data
    .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
    .map((item) => ({
      ...item,
      icon: getIconForSiteType(item.name),
    }));

  const goPrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const goNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <div 
      className="rounded-lg p-4 flex flex-col justify-between"
      style={{ 
        backgroundColor: rgbColors.white,
        boxShadow: `0 1px 3px 0 ${rgbColors.shadow.light}, 0 1px 2px 0 ${rgbColors.shadow.light}`,
        height: '400px'
      }}
    >
      <div>
        <div 
          className="text-sm font-medium mb-1"
          style={{ color: rgbColors.gray[800] }}
        >
          {title}
        </div>
        {subtitle && (
          <div 
            className="text-xs mb-2"
            style={{ color: rgbColors.gray[600] }}
          >
            {subtitle}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {pageData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="w-10 h-10 flex items-center justify-center text-2xl mb-1">
                <span>{item.icon}</span>
              </div>
              <div 
                className="text-sm font-medium"
                style={{ color: rgbColors.gray[800] }}
              >
                {item.value}
              </div>
              <div 
                className="text-xs"
                style={{ color: rgbColors.gray[600] }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination - centered and spaced lower */}
      <div className="flex justify-center items-center gap-3 mt-6 text-xs">
        <button
          onClick={goPrev}
          disabled={page === 0}
          className="px-3 py-1 rounded border transition-colors duration-200"
          style={{
            color: page === 0 ? rgbColors.gray[400] : rgbColors.blue[600],
            borderColor: page === 0 ? rgbColors.gray[300] : rgbColors.blue[400],
            backgroundColor: page === 0 ? 'transparent' : 'transparent'
          }}
        >
          Prev
        </button>
        <span style={{ color: rgbColors.gray[800] }}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={goNext}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 rounded border transition-colors duration-200"
          style={{
            color: page >= totalPages - 1 ? rgbColors.gray[400] : rgbColors.blue[600],
            borderColor: page >= totalPages - 1 ? rgbColors.gray[300] : rgbColors.blue[400],
            backgroundColor: page >= totalPages - 1 ? 'transparent' : 'transparent'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LocationTypeGrid;