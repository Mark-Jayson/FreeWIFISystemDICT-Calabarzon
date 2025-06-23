// components/dashboard/LocationTypeGrid.jsx
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
    <div className="bg-white rounded-lg shadow p-4 h-400px flex flex-col justify-between">
      <div>
        <div className="text-sm font-medium mb-1">{title}</div>
        {subtitle && <div className="text-xs text-gray-600 mb-2">{subtitle}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {pageData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="w-10 h-10 flex items-center justify-center text-2xl mb-1">
                <span>{item.icon}</span>
              </div>
              <div className="text-sm font-medium">{item.value}</div>
              <div className="text-xs text-gray-600">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination - centered and spaced lower */}
      <div className="flex justify-center items-center gap-3 mt-6 text-xs">
        <button
          onClick={goPrev}
          disabled={page === 0}
          className={`px-3 py-1 rounded border ${
            page === 0 ? 'text-gray-400 border-gray-300' : 'text-blue-600 border-blue-400'
          }`}
        >
          Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={goNext}
          disabled={page >= totalPages - 1}
          className={`px-3 py-1 rounded border ${
            page >= totalPages - 1 ? 'text-gray-400 border-gray-300' : 'text-blue-600 border-blue-400'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LocationTypeGrid;