import { useState } from "react";

export default function TabComp({ tabs, tabContents }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex justify-center space-x-4 border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === index
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-blue-400"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-4">
        {tabContents[activeTab]}
      </div>
    </div>
  );
}
