import React from 'react';
import { ChevronDown } from 'lucide-react';

const Header = ({ region, onRegionChange }) => {

  const handleRegionChange = (e) => {
    // Call the parent's callback function with the new selected value
    onRegionChange(e.target.value);
  };
  
  return (
    <div className="p-6 pb-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          
             
            
                      <select
                        name="province"
                        value={region}
                        onChange={onRegionChange}
                        className="px-4 py-2 bg-white border  rounded-md shadow flex items-center gap-2 text-sm"
                        required
                      >
                        
                        <option value="Region IV-A CALABARZON"> Region IV-A CALABARZON</option>
                        <option value="Cavite">Cavite</option>
                        <option value="Laguna">Laguna</option>
                        <option value="Batangas">Batangas</option>
                        <option value="Rizal">Rizal</option>
                        <option value="Quezon">Quezon</option>
                      </select>
                    
          
        </div>
      </div>
    </div>
  );
};

export default Header;