import React from "react";
export default function OrderProgressBar({ status }) {
  const steps = ["PENDING", "ACCEPTED", "DELIVERED"];
  const currentIndex = steps.indexOf(status);

  if (status === "REJECTED") {
    return (
      <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
        ❌ Order Rejected
      </div>
    );
  }

  return (
    <div className="mt-6 w-full max-w-lg">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-green-600 rounded-full transition-all duration-500"
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div key={step} className="flex flex-col items-center w-1/3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${
                    isCompleted
                      ? "bg-green-600 text-white"
                      : isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-200"
                      : "bg-gray-300 text-gray-600"
                  }`}
              >
                {index + 1}
              </div>

              <span
                className={`mt-2 text-xs font-semibold
                  ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
