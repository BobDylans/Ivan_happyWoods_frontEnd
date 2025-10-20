import React from "react";

interface HappyLeafProps {
  className?: string;
  size?: number;
}

/**
 * HappyLeaf Icon - Brand identity symbol
 * A rounded leaf with gentle curves representing warmth and nature
 */
export const HappyLeaf: React.FC<HappyLeafProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaf shape with rounded curves */}
      <path
        d="M12 3C7.58 3 4 6.58 4 11c0 3.5 2.5 6.5 6 7.5.5.1 1 .1 1.5 0 3.5-1 6-4 6-7.5 0-4.42-3.58-8-8-8z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Inner detail */}
      <path
        d="M12 5c-1.5 0-3 .5-4 1.5 0 0 1.5 4 4 5.5s4-5.5 4-5.5C15 5.5 13.5 5 12 5z"
        fill="currentColor"
        opacity="0.3"
      />
      {/* Center vein */}
      <path
        d="M12 7v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
};
