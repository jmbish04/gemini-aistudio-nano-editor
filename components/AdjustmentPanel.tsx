/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useEffect } from 'react';

interface AdjustmentPanelProps {
  onApplyAdjustment: (prompt: string) => void;
  isLoading: boolean;
}

const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({ onApplyAdjustment, isLoading }) => {
  const [mode, setMode] = useState<'preset' | 'slider' | 'custom'>('preset');
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [wasLoading, setWasLoading] = useState(false);

  // Effect to reset state after an adjustment is applied
  useEffect(() => {
    if (isLoading) {
      setWasLoading(true);
    }
    if (!isLoading && wasLoading) {
      setSelectedPresetPrompt(null);
      setCustomPrompt('');
      setBrightness(0);
      setContrast(0);
      setMode('preset');
      setWasLoading(false);
    }
  }, [isLoading, wasLoading]);

  const presets = [
    { name: 'Blur Background', prompt: 'Apply a realistic depth-of-field effect, making the background blurry while keeping the main subject in sharp focus.', tooltip: "Applies a 'bokeh' effect, making the background blurry to focus on the main subject." },
    { name: 'Enhance Details', prompt: 'Slightly enhance the sharpness and details of the image without making it look unnatural.', tooltip: "Subtly sharpens the image to bring out fine details and textures." },
    { name: 'Warmer Lighting', prompt: 'Adjust the color temperature to give the image warmer, golden-hour style lighting.', tooltip: "Adjusts the color balance to give the image a warm, 'golden hour' feel." },
    { name: 'Studio Light', prompt: 'Add dramatic, professional studio lighting to the main subject.', tooltip: "Adds dramatic lighting to the main subject, mimicking a professional studio setup." },
  ];

  const activePrompt = useMemo(() => {
    if (mode === 'preset') return selectedPresetPrompt;
    if (mode === 'custom') return customPrompt;
    if (mode === 'slider' && (brightness !== 0 || contrast !== 0)) {
        const parts = [];
        const describe = (val: number, positive: string, negative: string) => {
            const absVal = Math.abs(val);
            let magnitude = '';
            if (absVal > 75) magnitude = 'significantly';
            else if (absVal > 35) magnitude = 'moderately';
            else magnitude = 'slightly';
            return `${magnitude} ${val > 0 ? positive : negative}`;
        };

        if (brightness !== 0) parts.push(describe(brightness, 'increase brightness', 'decrease brightness'));
        if (contrast !== 0) parts.push(describe(contrast, 'increase contrast', 'decrease contrast'));
        
        return `Photographically adjust the image: ${parts.join(' and ')}.`;
    }
    return null;
  }, [mode, selectedPresetPrompt, customPrompt, brightness, contrast]);
  
  const handlePresetClick = (prompt: string) => {
    setMode('preset');
    setSelectedPresetPrompt(prompt);
    setCustomPrompt('');
    setBrightness(0);
    setContrast(0);
  };
  
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMode('custom');
    setCustomPrompt(e.target.value);
    setSelectedPresetPrompt(null);
    setBrightness(0);
    setContrast(0);
  };

  const handleSliderChange = (type: 'brightness' | 'contrast', value: number) => {
    setMode('slider');
    if (type === 'brightness') setBrightness(value);
    if (type === 'contrast') setContrast(value);
    setSelectedPresetPrompt(null);
    setCustomPrompt('');
  };

  const handleApply = () => {
    if (activePrompt) {
      onApplyAdjustment(activePrompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300">Apply a Professional Adjustment</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset.prompt)}
            disabled={isLoading}
            title={preset.tooltip}
            className={`w-full text-center bg-white/10 border border-transparent text-gray-200 font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 hover:border-white/20 active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'preset' && selectedPresetPrompt === preset.prompt ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500' : ''}`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Manual Sliders */}
      <div className={`p-4 rounded-lg transition-all ${mode === 'slider' ? 'bg-black/20' : ''}`}>
        <div className="flex flex-col gap-4">
            {/* Brightness Slider */}
            <div className="flex flex-col gap-1">
                <label htmlFor="brightness" className="flex justify-between items-center text-sm font-medium text-gray-300">
                    <span>Brightness</span>
                    <span className="font-bold text-base text-white">{brightness}</span>
                </label>
                <input 
                    id="brightness" type="range" min="-100" max="100" value={brightness}
                    onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value, 10))}
                    disabled={isLoading}
                    title="Drag to make the image brighter or darker."
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            {/* Contrast Slider */}
            <div className="flex flex-col gap-1">
                <label htmlFor="contrast" className="flex justify-between items-center text-sm font-medium text-gray-300">
                    <span>Contrast</span>
                    <span className="font-bold text-base text-white">{contrast}</span>
                </label>
                <input 
                    id="contrast" type="range" min="-100" max="100" value={contrast}
                    onChange={(e) => handleSliderChange('contrast', parseInt(e.target.value, 10))}
                    disabled={isLoading}
                    title="Drag to adjust the difference between light and dark areas."
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
      </div>

      <input
        type="text"
        value={customPrompt}
        onChange={handleCustomChange}
        placeholder="Or describe an adjustment (e.g., 'change background to a forest')"
        title="Describe any adjustment you can imagine (e.g., 'make the sky a dramatic purple')."
        className={`flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base ${mode === 'custom' ? 'ring-2 ring-blue-500' : 'focus:ring-blue-500'}`}
        disabled={isLoading}
      />

      {activePrompt && (
        <div className="animate-fade-in flex flex-col gap-4 pt-2">
            <button
                onClick={handleApply}
                title="Applies the selected preset, slider adjustments, or your custom-described adjustment to the image."
                className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !activePrompt.trim()}
            >
                Apply Adjustment
            </button>
        </div>
      )}
    </div>
  );
};

export default AdjustmentPanel;