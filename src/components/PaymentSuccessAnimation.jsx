import React from "react";

export default function PaymentSuccessAnimation() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 text-center w-80 shadow-xl animate-scaleIn">
        
        {/* ✅ Animated Tick */}
        <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-600 animate-drawTick"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-green-600">
          Payment Successful
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          Your order is being confirmed
        </p>
      </div>
    </div>
  );
}
