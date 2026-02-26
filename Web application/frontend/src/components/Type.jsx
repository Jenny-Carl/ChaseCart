import React from "react";
import Typewriter from "typewriter-effect";

function Type({ texts }) {
  return (
    <Typewriter
      options={{
        strings: texts,       // ✅ utilise les textes passés en props
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
