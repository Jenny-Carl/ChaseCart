import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter le type d'appareil (mobile, tablette, desktop)
 * @returns {Object} { isMobile, isTablet, isDesktop, deviceType }
 */
const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    type: 'desktop'
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Détection par user agent
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /ipad|android(?!.*mobile)|tablet/i;
      
      const isMobileUA = mobileRegex.test(userAgent);
      const isTabletUA = tabletRegex.test(userAgent);
      
      // Détection par largeur d'écran (en pixels)
      const isMobileWidth = width < 768;
      const isTabletWidth = width >= 768 && width < 1024;
      const isDesktopWidth = width >= 1024;
      
      // Combinaison des deux méthodes pour plus de précision
      const isMobile = isMobileUA || (isMobileWidth && !isTabletUA);
      const isTablet = isTabletUA || (isTabletWidth && !isMobileUA);
      const isDesktop = !isMobile && !isTablet && isDesktopWidth;
      
      setDeviceType({
        isMobile,
        isTablet,
        isDesktop,
        type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
        width
      });
    };

    // Détection initiale
    handleResize();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
};

export default useDeviceDetection;
