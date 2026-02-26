import React from 'react';
import BannerMobile from '../../components/mobile/BannerMobile';
import CategoriesMobile from '../../components/mobile/CategoriesMobile';

const HomeMobile = () => {
  return (
    <div className="pb-16">
      <BannerMobile />
      <CategoriesMobile />
    </div>
  );
};

export default HomeMobile;
