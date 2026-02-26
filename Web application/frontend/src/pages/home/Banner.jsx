import React from 'react'
import { Link } from 'react-router-dom';
import bannerImg from "../../assets/supermarket1.png"
import Type from '../../components/Type';

const Banner = () => {
  return (
    <section
      className="relative min-h-[420px] flex items-start justify-center text-center pt-16"
      style={{
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Banner ChaseCart"
    >
      {/* Overlay blanc avec opacité */}
      <div className="absolute inset-0 bg-white/80 pointer-events-none" />

      <div className="header__content relative z-20 max-w-3xl text-black px-6">
        <h4 className="uppercase font-medium text-pink-600 -tracking-normal">
          <Type texts={["Welcome to ChaseCart – Your Intelligent Shopping Assistant"]} />
        </h4>
        <h1 className="text-5xl font-semibold mt-2">ChaseCart<span style={{ color: "var(--primary-color)" }}>.</span></h1>
        <p className="mt-4 text-medium text-gray-800 font-medium leading-relaxed">
          Discover a smarter, faster way to shop. ChaseCart is here to guide you effortlessly to everything you need.
          Say goodbye to the hassle and hello to convenience.
          Experience innovation at your fingertips with a seamless shopping journey designed just for you.
        <button className="btn mt-6">
          <Link to="/shop">EXPLORE NOW</Link>
        </button>
        </p>

      </div>
    </section>
  )
}

export default Banner
