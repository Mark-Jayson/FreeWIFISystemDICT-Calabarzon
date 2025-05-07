import React from 'react';
import PropTypes from 'prop-types';

/**
 * Enhanced base Card component used as foundation for all dashboard cards
 * 
 * @param {Object} props
 * @param {string} [props.title] - Card title
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.bgColor="bg-white"] - Background color class
 * @param {boolean} [props.showHeader=true] - Whether to show the header section
 * @param {string} [props.accentColor] - Color for the accent bar (if used)
 * @returns {React.ReactElement}
 */
const Card = ({ 
  title, 
  subtitle,
  children, 
  className = "",
  bgColor = "bg-white",
  showHeader = true,
  accentColor
}) => {
  return (
    <div className={`${bgColor} rounded-lg shadow p-4 h-full ${className}`}>
      {showHeader && (title || subtitle) && (
        <div className="mb-4">
          <div className="flex items-start">
            {accentColor && (
              <div className={`w-1 h-12 ${accentColor} mr-2 mt-1`}></div>
            )}
            <div>
              {title && <div className="text-sm font-medium">{title}</div>}
              {subtitle && <div className="text-xs text-gray-600">{subtitle}</div>}
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  bgColor: PropTypes.string,
  showHeader: PropTypes.bool,
  accentColor: PropTypes.string
};

export default Card;