import React, { useState, useEffect } from "react";
import { onSnapshot, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import cartImg from "../../assets/cart.png";
import Type from "../../components/Type";
import { db } from "../../firebase";

const CartNavigationPage = () => {
  const navigate = useNavigate();

  const [isMoving, setIsMoving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentProduct, setCurrentProduct] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const isArrived = !isMoving && !isCompleted && progress.total > 0;  // phase "arrived" or "idle" with data
  const onLastItem = progress.total > 0 && progress.current === progress.total;

  const nextDisabled = !isArrived || onLastItem;
  const doneDisabled = !isArrived || !onLastItem;

useEffect(() => {
  const doneRef = doc(db, "signals", "done");
  const unsub = onSnapshot(doneRef, (snap) => {
    const data = snap.data() || {};
    setProgress({
      current: Number(data.current_index || 0),
      total: Number(data.total_items || 0),
    });
    setCurrentProduct(data.current_product || "");
    setIsMoving(data.phase === "moving");
    setIsCompleted(data.status === "finished");
  });
  return () => unsub();
}, []);


  const handleNextItem = async () => {
  // COMMENTED FOR DEMO - Firestore signal temporarily disabled
  await setDoc(doc(db, "signals", "done"), { status: true });
  };
  const handleCheckout = async () => {
    // COMMENTED FOR DEMO - Firestore signal temporarily disabled
    await setDoc(doc(db, "signals", "done"), { status: "finished" });
    navigate("/checkout");
  };

  return (
    <section className="section__container bg-primary-light h-screen flex flex-col items-center justify-between text-center p-8 overflow-hidden">
      {/* Header */}
      <div>
        <h2 className="section__header capitalize text-3xl font-bold mb-4">
          Your Cart Is On The Move 🛒
        </h2>
        <div className="section__subheader text-lg text-gray-700 max-w-2xl mx-auto">
          <Type
            texts={[
              "ChaseCart is collecting your items...",
              "Press the button when you're ready to checkout!",
            ]}
          />
        </div>
      </div>

      {/* Progress indicator */}
      {progress.total > 0 && (
        <p className="text-gray-600 mt-2">
           Progress: {progress.current}/{progress.total}
          {currentProduct && ` — Now heading to: ${currentProduct}`}
        </p>
      )}

      {/* Animated cart */}
      <div className="flex-1 flex items-center justify-center relative w-full">
        <img
          src={cartImg}
          alt="Shopping cart"
          className="w-[400px] h-auto object-contain animate-moveCart"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {/* NEXT ITEM */}
        <button
          onClick={handleNextItem}
          disabled={nextDisabled}
          className={`px-8 py-3 rounded-lg font-medium transition duration-300 ${
            nextDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isMoving ? "Moving..." : "Next Item"}
        </button>

        {/* CHECKOUT */}
        <button
          onClick={handleCheckout}
          className={`px-8 py-3 rounded-lg font-medium transition duration-300 bg-pink-500 text-white hover:bg-green-600`}
        >   
          I'm done → Checkout
        </button>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes moveCart {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-moveCart {
            animation: moveCart 6s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default CartNavigationPage;
