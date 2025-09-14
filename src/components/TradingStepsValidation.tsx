import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Target, Plus, X, Settings, RotateCcw } from 'lucide-react';

interface TradingStep {
  id: string;
  text: string;
  completed: boolean;
}

interface TradingStepsValidationProps {
  steps: TradingStep[];
  onStepsChange: (steps: TradingStep[]) => void;
  disabled?: boolean;
}

export const TradingStepsValidation: React.FC<TradingStepsValidationProps> = ({
  steps,
  onStepsChange,
  disabled = false
}) => {
  const [newStepText, setNewStepText] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Default trading steps template
  const defaultSteps = [
    'Market trend analysis completed',
    'Support/Resistance levels identified',
    'Risk management plan set',
    'Entry signal confirmed',
    'Volume analysis done',
    'News/fundamentals checked'
  ];

  const addStep = () => {
    if (newStepText.trim()) {
      const newStep: TradingStep = {
        id: Date.now().toString(),
        text: newStepText.trim(),
        completed: false
      };
      onStepsChange([...steps, newStep]);
      setNewStepText('');
    }
  };

  const removeStep = (stepId: string) => {
    onStepsChange(steps.filter(step => step.id !== stepId));
  };

  const toggleStep = (stepId: string) => {
    onStepsChange(
      steps.map(step =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const updateStepText = (stepId: string, newText: string) => {
    onStepsChange(
      steps.map(step =>
        step.id === stepId ? { ...step, text: newText } : step
      )
    );
  };

  const loadDefaultSteps = () => {
    const newSteps: TradingStep[] = defaultSteps.map((stepText, index) => ({
      id: `default-${Date.now()}-${index}`,
      text: stepText,
      completed: false
    }));
    onStepsChange(newSteps);
    setShowSettings(false);
  };

  const clearAllSteps = () => {
    onStepsChange([]);
  };

  // Calculate completion percentage
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const completionPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Trading Setup Validation
        </h3>
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          disabled={disabled}
          className="ml-auto p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
            Quick Setup Options
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadDefaultSteps}
              disabled={disabled}
              className="inline-flex items-center px-3 py-1.5 border border-blue-300 dark:border-blue-600 rounded-md text-xs font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Target className="h-3 w-3 mr-1" />
              Load Default Checklist
            </button>
            <button
              type="button"
              onClick={clearAllSteps}
              disabled={disabled || steps.length === 0}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 rounded-md text-xs font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear All
            </button>
          </div>
          <div className="mt-3 text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium mb-1">Default checklist includes:</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-600 dark:text-blue-400">
              {defaultSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Add New Step */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newStepText}
          onChange={(e) => setNewStepText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addStep()}
          disabled={disabled}
          placeholder="Add a trading criteria (e.g., 'RSI below 30', 'Support level confirmed')"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
        />
        <button
          type="button"
          onClick={addStep}
          disabled={disabled || !newStepText.trim()}
          className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Steps List */}
      {steps.length > 0 && (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <button
                type="button"
                onClick={() => toggleStep(step.id)}
                disabled={disabled}
                className="mt-0.5 text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {step.completed ? (
                  <CheckSquare className="h-5 w-5" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={step.text}
                  onChange={(e) => updateStepText(step.id, e.target.value)}
                  disabled={disabled}
                  className={`w-full bg-transparent border-none focus:outline-none text-sm ${
                    step.completed
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-900 dark:text-white'
                  }`}
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeStep(step.id)}
                disabled={disabled}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Completion Summary */}
      {steps.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Setup Validation:
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedSteps}/{totalSteps} criteria
              </span>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  completionPercentage === 100
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : completionPercentage >= 75
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}
              >
                {completionPercentage}%
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  completionPercentage === 100
                    ? 'bg-green-600'
                    : completionPercentage >= 75
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          
          {/* Validation Message */}
          <div className="mt-2">
            {completionPercentage === 100 ? (
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                ✓ All trading criteria validated - Setup complete!
              </p>
            ) : completionPercentage >= 75 ? (
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                ⚠ Most criteria met - Consider reviewing incomplete items
              </p>
            ) : (
              <p className="text-xs text-red-600 dark:text-red-400">
                ⚠ Setup incomplete - Review your trading criteria
              </p>
            )}
          </div>
        </div>
      )}

      {steps.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            Add trading criteria to validate your setup
          </p>
          <p className="text-xs mt-1">
            Use settings ⚙️ to load default checklist or add custom criteria
          </p>
        </div>
      )}
    </div>
  );
};