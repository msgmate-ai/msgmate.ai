import { FC } from 'react';

const Logo: FC = () => {
  return (
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 relative">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        className="w-full h-full"
      >
        {/* Speech bubble with heart */}
        <path 
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
          fill="#DE3163"
        />
        <path 
          d="M21 11.5c0 .97-.23 1.95-.7 2.83A11.98 11.98 0 0112 21a11.98 11.98 0 01-8.3-6.67A5.85 5.85 0 013 11.5c0-3.07 2.42-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09C14.09 6.81 15.76 6 17.5 6 20.58 6 23 8.42 23 11.5c0 .97-.23 1.95-.7 2.83"
          fill="#001E3C"
          fillOpacity="0.2"
          stroke="#001E3C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Logo;
