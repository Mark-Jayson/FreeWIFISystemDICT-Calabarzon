import React, { useRef, useEffect } from 'react';

const FilterModal = ({ filterItem, selectedValue, onSelectOption, onClose }) => {
  // Create a ref to attach to the modal content
  const modalContentRef = useRef(null);

  if (!filterItem) return null;

  // Effect to add and remove event listener for clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the modal content, call onClose
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener when the modal is open
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts or modal closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]); // Re-run effect if onClose changes

  return (
    // The outermost div acts as the overlay. Add onClick to this.
    <div
      className="fixed inset-0 bg-opacity-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} // RGB override for transparency
      onClick={onClose} // This handles clicks directly on the overlay
    >
      {/* Attach the ref to the modal content div */}
      <div
        className="rounded-lg shadow-xl p-8 w-full max-w-md mx-8"
        style={{ 
          backgroundColor: 'rgb(255, 255, 255)', // RGB override for white
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' // RGB shadow override
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from bubbling up to the overlay
        ref={modalContentRef} // Attach the ref here
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold" style={{ color: 'rgb(31, 41, 55)' }}>
            Select {filterItem.label}
          </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-700"
            style={{ color: 'rgb(107, 114, 128)' }}
            onMouseEnter={(e) => e.target.style.color = 'rgb(55, 65, 81)'}
            onMouseLeave={(e) => e.target.style.color = 'rgb(107, 114, 128)'}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto">
          {filterItem.options.map(option => (
            <button
              key={option}
              className="block w-full text-left px-4 py-2 text-sm rounded-md transition-colors duration-150"
              style={{
                backgroundColor: selectedValue === option ? 'rgb(59, 130, 246)' : 'transparent',
                color: selectedValue === option ? 'rgb(255, 255, 255)' : 'rgb(55, 65, 81)'
              }}
              onMouseEnter={(e) => {
                if (selectedValue === option) {
                  e.target.style.backgroundColor = 'rgb(37, 99, 235)'; // blue-600
                } else {
                  e.target.style.backgroundColor = 'rgb(243, 244, 246)'; // gray-100
                }
              }}
              onMouseLeave={(e) => {
                if (selectedValue === option) {
                  e.target.style.backgroundColor = 'rgb(59, 130, 246)'; // blue-500
                } else {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              onClick={() => {
                onSelectOption(filterItem.id, option);
                onClose(); // Close modal after selection
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Option to clear the filter */}
        <button
          className="mt-4 w-full text-center px-4 py-2 text-sm rounded-md transition-colors duration-150"
          style={{
            color: 'rgb(107, 114, 128)', // gray-500
            borderColor: 'rgb(209, 213, 219)', // gray-300
            borderWidth: '1px',
            borderStyle: 'solid',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgb(243, 244, 246)'; // gray-100
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
          onClick={() => {
            onSelectOption(filterItem.id, null); // Set to null to clear
            onClose(); // Close modal after clearing
          }}
        >
          Clear {filterItem.label} Filter
        </button>
      </div>
    </div>
  );
};

export default FilterModal;