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

const ITEMS_PER_PAGE = 6;

const LocationTypeGrid = ({ title, subtitle, data }) => {
  const [page, setPage] = useState(0);

  // Custom RGBA colors
  const colors = {
    background: 'rgba(255, 255, 255, 1)', // bg-white
    text: {
      primary: 'rgba(17, 24, 39, 1)', // text-gray-800/900
      secondary: 'rgba(75, 85, 99, 1)', // text-gray-600
      muted: 'rgba(156, 163, 175, 1)', // text-gray-400
    },
    blue: {
      400: 'rgba(96, 165, 250, 1)', // border-blue-400
      600: 'rgba(37, 99, 235, 1)', // text-blue-600
    },
    gray: {
      300: 'rgba(209, 213, 219, 1)', // border-gray-300
    },
    shadow: 'rgba(0, 0, 0, 0.1)', // shadow equivalent
  };

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
        backgroundColor: colors.background,
        boxShadow: `0 1px 3px 0 ${colors.shadow}, 0 1px 2px 0 ${colors.shadow}`,
        height: '400px'
      }}
    >
      <div>
        <div 
          className="text-sm font-medium mb-1"
          style={{ color: colors.text.primary }}
        >
          {title}
        </div>
        {subtitle && (
          <div 
            className="text-xs mb-2"
            style={{ color: colors.text.secondary }}
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
                style={{ color: colors.text.primary }}
              >
                {item.value}
              </div>
              <div 
                className="text-xs"
                style={{ color: colors.text.secondary }}
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
            color: page === 0 ? colors.text.muted : colors.blue[600],
            borderColor: page === 0 ? colors.gray[300] : colors.blue[400]
          }}
        >
          Prev
        </button>
        <span style={{ color: colors.text.primary }}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={goNext}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 rounded border transition-colors duration-200"
          style={{
            color: page >= totalPages - 1 ? colors.text.muted : colors.blue[600],
            borderColor: page >= totalPages - 1 ? colors.gray[300] : colors.blue[400]
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LocationTypeGrid;