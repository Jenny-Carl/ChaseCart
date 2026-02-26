import React, { useState, useRef, useEffect } from 'react';

const ScannerInput = ({ 
  onScanSuccess, 
  onScanError, 
  placeholder = "Invisible scanner...",
  autoFocus = true,
  disabled = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const inputRef = useRef(null);

  // Auto-focus sur le champ invisible
  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled && isActive) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled, isActive]);

  // Maintenir le focus sauf si un autre input est sélectionné
  useEffect(() => {
    const handleFocusChange = () => {
      const activeElement = document.activeElement;
      const isFormInput = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT'
      ) && activeElement !== inputRef.current;

      if (isFormInput) {
        setIsActive(false);
      } else {
        setIsActive(true);
        setTimeout(() => {
          if (inputRef.current && !disabled) {
            inputRef.current.focus();
          }
        }, 100);
      }
    };

    document.addEventListener('focusin', handleFocusChange);
    document.addEventListener('click', handleFocusChange);

    return () => {
      document.removeEventListener('focusin', handleFocusChange);
      document.removeEventListener('click', handleFocusChange);
    };
  }, [disabled]);

  // Traitement automatique quand le scanner termine
  useEffect(() => {
    if (inputValue.length > 0 && !isProcessing) {
      const currentTime = Date.now();
      
      // Éviter les scans trop rapides (debounce de 500ms)
      if (currentTime - lastScanTime < 500) {
        return;
      }

      // Auto-traitement après une pause (simule la fin du scan)
      const timer = setTimeout(() => {
        if (inputValue.trim().length > 0) {
          handleScan(inputValue.trim());
        }
      }, 100); // 100ms après la dernière frappe

      return () => clearTimeout(timer);
    }
  }, [inputValue, isProcessing, lastScanTime]);

  const handleScan = async (scanCode) => {
    if (isProcessing || !scanCode) return;

    setIsProcessing(true);
    setLastScanTime(Date.now());

    try {
      console.log(`🔍 Code scanned: ${scanCode}`);
      
      if (onScanSuccess) {
        await onScanSuccess(scanCode);
      }
      
      // Effacer le champ après traitement réussi
      setInputValue('');
      
      // Remettre le focus pour le prochain scan
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Erreur lors du traitement du scan:', error);
      
      if (onScanError) {
        onScanError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleKeyPress = (e) => {
    // Si Enter est pressé, traiter immédiatement
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleScan(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="scanner-input-container">
      {/* Champ input invisible mais fonctionnel */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder=""
        disabled={disabled || isProcessing}
        className="absolute opacity-0 -z-10 w-1 h-1"
        autoComplete="off"
        spellCheck="false"
        tabIndex={-1}
      />

      {/* Indicateur de statut seulement */}
      <div className="text-sm">
        {isProcessing ? (
          <div className="text-blue-600 flex items-center space-x-2">
            <span className="animate-spin">🔄</span>
            <span>Processing scan...</span>
          </div>
        ) : isActive ? (
          <div className="text-green-600 flex items-center space-x-2">
            <span>Scanner ready</span>
          </div>
        ) : (
          <div className="text-gray-500 flex items-center space-x-2">
            <span>Scanner paused</span>
          </div>
        )}
      </div>

      {/* Instructions discrètes */}
      <div className="mt-2 text-xs text-gray-400">
        Please scan the barcodes of your products to confirm them.
      </div>
    </div>
  );
};

export default ScannerInput;