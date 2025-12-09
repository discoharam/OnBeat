import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> { loading?: boolean; }

export const Button = ({ children, loading, className, ...props }: Props) => (
  <button 
    disabled={loading} 
    className={`px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 ${className || ''}`}
    {...props}
  >
    {loading ? "Processing..." : children}
  </button>
);
