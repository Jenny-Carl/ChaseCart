// src/pages/WhyChaseCart.jsx
import React from "react";
import { Link } from "react-router-dom";

const perks = [
  {
    icon: "ri-robot-2-line",
    title: "Smart In-Store Guidance",
    desc: "Send your list to our assistant cart. It guides you aisle-by-aisle using LiDAR, RFID, and IR line following.",
  },
  {
    icon: "ri-flashlight-line",
    title: "Faster Shopping",
    desc: "Optimized routes reduce back-and-forth. Pick, scan, done. We keep your list updated in real time.",
  },
  {
    icon: "ri-shield-check-line",
    title: "Safe & Reliable",
    desc: "Obstacle detection, soft stops, and E-stop hardware built in. Your safety comes first.",
  },
  {
    icon: "ri-smartphone-line",
    title: "Seamless Experience",
    desc: "Log in, plan, and pay from your phone. Your cart stays in sync with your account.",
  },
];

const steps = [
  {
    label: "01",
    title: "Plan",
    desc: "Create or import your list. We map items to aisles and schedule the fastest route.",
  },
  {
    label: "02",
    title: "Pair",
    desc: "Scan a QR code in-store to pair your phone with a ChaseCart in seconds.",
  },
  {
    label: "03",
    title: "Collect",
    desc: "Follow the cart. Pick items as you go. Barcode scans auto-update your list.",
  },
  {
    label: "04",
    title: "Checkout",
    desc: "Finish at self-checkout or in-app. Receipts and spending insights included.",
  },
];

const stats = [
  { kpi: "25–40%", label: "time saved per trip" },
  { kpi: "95%", label: "route accuracy (pilot)" },
  { kpi: "< 0.5 m/s", label: "indoor safe speed" },
  { kpi: "24/7", label: "cloud sync & support" },
];

export default function WhyChaseCart() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-rose-50 to-white" />
        <div className="section__container relative py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center px-6">
            <span className="inline-flex items-center gap-2 text-pink-600 font-medium uppercase tracking-wide">
              <i className="ri-sparkling-2-line" /> Why ChaseCart
            </span>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-gray-900">
              Shop smarter, not longer.
            </h1>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              ChaseCart blends robotics, computer vision, and a sleek web app to guide you
              through the store—so you finish faster, forget less, and enjoy the trip.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-pink-600 text-white px-5 py-3 font-medium hover:bg-pink-700 transition"
              >
                Start shopping <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="section__container py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          {perks.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-2xl">
                <i className={p.icon} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{p.title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section__container py-12 md:py-16">
        <div className="px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center">
            How it works
          </h2>
          <p className="text-gray-600 text-center mt-2">
            From list to checkout in four simple steps.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-gray-200 bg-white p-6 relative"
              >
                <span className="absolute -top-4 left-6 inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white text-sm font-semibold">
                  {s.label}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="section__container py-12 md:py-16">
        <div className="px-6 rounded-3xl bg-gradient-to-r from-pink-600 to-rose-500 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold">{s.kpi}</div>
                <div className="mt-2 text-sm opacity-90">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech highlight */}
      <section className="section__container py-12 md:py-16">
        <div className="px-6 grid lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Robotics + Cloud = Effortless shopping
            </h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Our pilot platform pairs an assistant cart (LiDAR, IR line following, ultrasonic
              safety, ESP32/Raspberry Pi) with a Firebase-powered web experience. Routes are
              optimized, scans sync instantly, and your history stays available across devices.
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <i className="ri-check-line text-pink-600 mt-1" />
                Real-time list sync and route adjustments
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-check-line text-pink-600 mt-1" />
                Safety-first motion with obstacle detection
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-check-line text-pink-600 mt-1" />
                Simple pairing via QR code—no app install
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
              >
                Contact sales <i className="ri-arrow-right-line" />
              </Link>
              <Link
                to="/cart-navigation"
                className="inline-flex items-center gap-2 rounded-lg bg-pink-600 text-white px-4 py-2 font-medium hover:bg-pink-700"
              >
                Try the flow
              </Link>
            </div>
          </div>

          {/* Decorative block (replace with your image if you want) */}
          <div className="order-1 lg:order-2">
            <div className="aspect-[16/10] w-full rounded-3xl border border-gray-200 bg-[radial-gradient(ellipse_at_top,rgba(244,114,182,0.25),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(244,114,182,0.25),transparent_60%)] flex items-center justify-center">
              <div className="p-6 text-center">
                <i className="ri-robot-2-line text-6xl text-pink-600" />
                <p className="mt-4 text-gray-700">
                  Replace this block with a screenshot, robot render, or supermarket illustration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section__container py-14">
        <div className="px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Ready to make shopping effortless?
          </h3>
          <p className="mt-2 text-gray-700">
            Join the pilot or start using the web app today.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-pink-600 text-white px-6 py-3 font-medium hover:bg-pink-700"
            >
              Explore the shop <i className="ri-arrow-right-line" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-800 hover:bg-gray-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
