import { forwardRef } from "react";

const Logo = forwardRef((props, ref) => {
  return (
    <svg ref={ref} width="240" height="240" viewBox="0 0 200 200" fill="none">
      <path
        d="M30 40 
           C80 10, 160 10, 170 40
           C175 55, 150 60, 120 55
           L110 55
           C105 90, 100 130, 95 170
           C94 185, 75 185, 75 170
           C80 120, 85 80, 90 55
           L80 55
           C50 60, 25 55, 30 40 Z"
        fill="none"
        stroke="#e3e4d8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export default Logo;
