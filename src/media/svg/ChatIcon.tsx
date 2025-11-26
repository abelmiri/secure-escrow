import React from "react";

export default function ChatIcon({
  width = "64",
  height = "64",
  color = "#155DFC",
  className = "",
  style,
}: {
  width?: string;
  height?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M7.97868 43.5785C8.37078 44.5676 8.45808 45.6514 8.22934 46.6905L5.38934 55.4638C5.29784 55.9088 5.3215 56.3697 5.45808 56.8029C5.59466 57.2361 5.83964 57.6273 6.16979 57.9392C6.49993 58.2512 6.9043 58.4737 7.34454 58.5856C7.78478 58.6974 8.24631 58.695 8.68534 58.5785L17.7867 55.9172C18.7673 55.7227 19.7828 55.8077 20.7173 56.1625C26.4117 58.8218 32.8623 59.3844 38.9311 57.7511C44.9998 56.1178 50.2967 52.3936 53.8872 47.2355C57.4777 42.0774 59.131 35.8169 58.5555 29.5586C57.9799 23.3003 55.2125 17.4464 50.7415 13.0297C46.2705 8.61296 40.3832 5.91727 34.1184 5.41823C27.8535 4.91918 21.6137 6.64885 16.4999 10.3021C11.386 13.9553 7.72676 19.2973 6.16773 25.3855C4.60869 31.4738 5.25006 37.917 7.97868 43.5785Z"
        stroke={color}
        strokeWidth="5.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

