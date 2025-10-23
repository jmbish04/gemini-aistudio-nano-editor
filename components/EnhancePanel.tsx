/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface EnhancePanelProps {
  onApplyEnhancement: (prompt: string, name: string) => void;
  isLoading: boolean;
}

const enhancements = [
  { 
    name: 'Auto Enhance', 
    prompt: 'Automatically enhance the image by improving brightness, contrast, and color balance for a clear and vibrant look.',
    tooltip: 'Improve lighting, color, and contrast automatically.'
  },
  { 
    name: 'Upscale', 
    prompt: 'Upscale the image to a higher resolution, intelligently adding detail and clarity without introducing artifacts.',
    tooltip: 'Increase image resolution and sharpness using AI.'
  },
  { 
    name: 'Remove Background', 
    prompt: 'Perfectly remove the background, leaving only the main subject against a transparent backdrop.',
    tooltip: 'Isolate the main subject by removing the background.'
  },
];

const EnhancePanel: React.FC<EnhancePanelProps> = ({ onApplyEnhancement, isLoading }) => {
  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300">Image Enhancements</h3>
      <p className="text-sm text-gray-400 -mt-2 text-center">Apply powerful one-click AI enhancements.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {enhancements.map(enhancement => (
          <button
            key={enhancement.name}
            onClick={() => onApplyEnhancement(enhancement.prompt, enhancement.name)}
            disabled={isLoading}
            title={enhancement.tooltip}
            className="w-full text-center bg-white/10 border border-transparent text-gray-200 font-semibold py-4 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 hover:border-white/20 active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enhancement.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnhancePanel;