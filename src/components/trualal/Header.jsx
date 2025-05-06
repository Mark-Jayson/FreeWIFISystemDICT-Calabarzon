import React from 'react';
import { ChevronDown } from 'lucide-react';

const Header = ({ region }) => {
  return (
    <div className="p-6 pb-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <button className="px-4 py-2 bg-white border rounded-md shadow flex items-center gap-2 text-sm">
            {region} <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;