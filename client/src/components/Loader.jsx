import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-orange-600 font-semibold tracking-wide animate-pulse">
          Connecting with Divinity...
        </p>
      </div>
    </div>
  );
}
