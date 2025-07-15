import React from 'react';
export default function ProgressBar({ value }) {
  return (
    <div className="progress" style={{ height: 18 }}>
      <div
        className="progress-bar bg-success"
        role="progressbar"
        style={{ width: `${value}%` }}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {value}%
      </div>
    </div>
  );
} 