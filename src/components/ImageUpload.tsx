import React, { useState } from 'react';
import { Link, X, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface ImageUrlInputProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const ImageUrlInput: React.FC<ImageUrlInputProps> = ({
  value,
  onChange,
  onRemove,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isValidUrl, setIsValidUrl] = useState(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setInputValue(url);
    
    if (url && validateUrl(url)) {
      setIsValidUrl(true);
      onChange(url);
    } else {
      setIsValidUrl(false);
      if (!url) onChange('');
    }
  };

  const handleRemove = () => {
    setInputValue('');
    setIsValidUrl(false);
    onRemove();
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Link className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="url"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="https://example.com/image.jpg"
          className="w-full pl-10 pr-10 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {inputValue && !isValidUrl && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Please enter a valid image URL (jpg, png, gif, webp, svg)
        </p>
      )}

      {value && isValidUrl && (
        <div className="relative group">
          <img
            src={value}
            alt="Trade screenshot preview"
            className="w-full h-32 sm:h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
            onError={() => setIsValidUrl(false)}
          />
          <div className="absolute top-2 right-2">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              title="Open image in new tab"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};