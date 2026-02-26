import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from "../../assets/supermarket1.png";
import Type from '../Type';

const BannerMobile = () => {
  return (
    <section
      className="relative min-h-[320px] flex items-center justify-center text-center px-4 py-12"
      style={{
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Banner ChaseCart Mobile"
    >
      {/* Overlay blanc avec opacité */}
      <div className="absolute inset-0 bg-white/85 pointer-events-none" />

      <div className="relative z-20 max-w-md text-black px-4">
        <h4 className="uppercase font-medium text-pink-600 text-xs tracking-wide mb-2">
          <Type texts={["Welcome to ChaseCart"]} />
        </h4>
        
        <h1 className="text-3xl font-bold mt-2">
          ChaseCart<span style={{ color: "var(--primary-color)" }}>.</span>
        </h1>
        
        <p className="mt-3 text-sm text-gray-800 leading-relaxed">
          Discover a smarter, faster way to shop. Experience innovation at your fingertips.
        </p>
        
        <button className="btn mt-4 text-sm py-2 px-6">
          <Link to="/shop">EXPLORE NOW</Link>
        </button>
      </div>
    </section>
  );
};

export default BannerMobile;
