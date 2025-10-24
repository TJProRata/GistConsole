import React from "react";

interface ProfileBlankProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function ProfileBlank({ className, ...props }: ProfileBlankProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20Z"
        fill="#BFBFBF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.11319 32.4144C10.809 28.6802 15.1988 26.25 20.1563 26.25C25.0348 26.25 29.3636 28.6034 32.0694 32.2369C28.9659 35.2981 24.7036 37.1875 20 37.1875C15.388 37.1875 11.2002 35.3709 8.11319 32.4144ZM26.875 16.0937C26.875 19.977 23.8669 23.125 20.1563 23.125C16.4456 23.125 13.4375 19.977 13.4375 16.0937C13.4375 12.2105 16.4456 9.0625 20.1563 9.0625C23.8669 9.0625 26.875 12.2105 26.875 16.0937Z"
        fill="white"
      />
    </svg>
  );
}
