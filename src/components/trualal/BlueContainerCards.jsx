import React from 'react';
import ExpiringContractsCard from './ExpiringContractsCard';
import ActivationChartCard from './ActivationChartCard';

const BlueContainerCards = ({ contractsData, activationData, highlightYear }) => {
  return (
    <div className="bg-blue-900 rounded-lg h-full p-4 flex flex-col gap-4">
      <div className="flex-1">
        <ExpiringContractsCard contracts={contractsData} />
      </div>
      
      <div className="flex-1">
        <ActivationChartCard 
          title="No. of WiFi Activated per Year of Activation"
          data={activationData}
          highlightYear={highlightYear}
        />
      </div>
    </div>
  );
};

export default BlueContainerCards;