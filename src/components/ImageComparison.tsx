import React, { useState, useRef } from 'react';
import { Upload, Link, X, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface ImageComparisonProps {
  beforeImage?: string;
  afterImage?: string;
  onBeforeImageChange: (url: string) => void;
  onAfterImageChange: (url: string) => void;
  onBeforeImageRemove: () => void;
  onAfterImageRemove: () => void;
  disabled?: boolean;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeImage,
  afterImage,
  onBeforeImageChange,
  onAfterImageChange,
  onBeforeImageRemove,
  onAfterImageRemove,
  disabled = false
}) => {
  const [beforeInputType, setBeforeInputType] = useState<'upload' | 'url'>('upload');
  const [afterInputType, setAfterInputType] = useState<'upload' | 'url'>('upload');
  const [beforeUrlInput, setBeforeUrlInput] = useState('');
  const [afterUrlInput, setAfterUrlInput] = useState('');
  
  const beforeFileRef = useRef<HTMLInputElement>(null);
  const afterFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File, type: 'before' | 'after') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'before') {
          onBeforeImageChange(result);
        } else {
          onAfterImageChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (url: string, type: 'before' | 'after') => {
    if (url.trim()) {
      if (type === 'before') {
        onBeforeImageChange(url.trim());
        setBeforeUrlInput('');
      } else {
        onAfterImageChange(url.trim());
        setAfterUrlInput('');
      }
    }
  };

  const ImageSlot: React.FC<{
    title: string;
    image?: string;
    inputType: 'upload' | 'url';
    urlInput: string;
    fileRef: React.RefObject<HTMLInputElement>;
    onInputTypeChange: (type: 'upload' | 'url') => void;
    onUrlInputChange: (value: string) => void;
    onFileChange: (file: File) => void;
    onUrlSubmit: () => void;
    onRemove: () => void;
  }> = ({
    title,
    image,
    inputType,
    urlInput,
    fileRef,
    onInputTypeChange,
    onUrlInputChange,
    onFileChange,
    onUrlSubmit,
    onRemove
  }) => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h4>
      
      {!image ? (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            
            {/* Input Type Toggle */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => onInputTypeChange('upload')}
                  disabled={disabled}
                  className={`px-3 py-2 text-xs font-medium border rounded-l-lg ${
                    inputType === 'upload'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } disabled:opacity-50`}
                >
                  <Upload className="h-3 w-3 mr-1 inline" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => onInputTypeChange('url')}
                  disabled={disabled}
                  className={`px-3 py-2 text-xs font-medium border-t border-b border-r rounded-r-lg ${
                    inputType === 'url'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } disabled:opacity-50`}
                >
                  <Link className="h-3 w-3 mr-1 inline" />
                  URL
                </button>
              </div>
            </div>

            {inputType === 'upload' ? (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileChange(file);
                  }}
                  disabled={disabled}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={disabled}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => onUrlInputChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onUrlSubmit()}
                  disabled={disabled}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
                <button
                  type="button"
                  onClick={onUrlSubmit}
                  disabled={disabled || !urlInput.trim()}
                  className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            onError={(e) => {
              console.error('Image failed to load:', image);
              onRemove();
            }}
          />
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 disabled:opacity-50"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ImageIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Chart Analysis
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImageSlot
          title="Before Entry"
          image={beforeImage}
          inputType={beforeInputType}
          urlInput={beforeUrlInput}
          fileRef={beforeFileRef}
          onInputTypeChange={setBeforeInputType}
          onUrlInputChange={setBeforeUrlInput}
          onFileChange={(file) => handleFileUpload(file, 'before')}
          onUrlSubmit={() => handleUrlSubmit(beforeUrlInput, 'before')}
          onRemove={onBeforeImageRemove}
        />

        {/* Arrow indicator for desktop */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg">
            <ArrowRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>

        <ImageSlot
          title="After Exit"
          image={afterImage}
          inputType={afterInputType}
          urlInput={afterUrlInput}
          fileRef={afterFileRef}
          onInputTypeChange={setAfterInputType}
          onUrlInputChange={setAfterUrlInput}
          onFileChange={(file) => handleFileUpload(file, 'after')}
          onUrlSubmit={() => handleUrlSubmit(afterUrlInput, 'after')}
          onRemove={onAfterImageRemove}
        />
      </div>

      {/* Mobile arrow indicator */}
      <div className="lg:hidden flex justify-center">
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg rotate-90">
          <ArrowRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </div>
      </div>
    </div>
  );
};