import React from 'react';

export function YouTubeIcon(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect x="2" y="7" width="20" height="10" rx="5" ry="5" />
      <polygon points="10 9 16 12 10 15 10 9" />
    </svg>
  );
}
