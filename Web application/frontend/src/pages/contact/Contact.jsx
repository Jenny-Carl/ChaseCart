import React from 'react'
import bannerImg from "../../assets/supermarket1.png"

const Contact = () => {
  return (
    <>
    <section
      className=" h-20 relative min-h-[300px] flex items-start justify-center text-center pt-20"
      style={{
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Banner ChaseCart"
    >
      {/* Overlay blanc avec opacité */}
      <div className="absolute inset-0 bg-white/60 pointer-events-none" />

      <div className="header__content relative z-20 max-w-3xl text-black px-6 items-center">
         <h2 className="section__header capitalize">Contact us</h2>
         <p className="section__subheader">
          Browse a wide selection of categories, from everyday essentials to exciting new finds. Whatever you're looking for, we've got something for you!
          </p>
        
      </div>
    </section>
    </>
  )
}


export default Contact