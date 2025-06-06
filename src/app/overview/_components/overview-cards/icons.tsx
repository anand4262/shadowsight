import type { SVGProps } from "react";

type SVGPropsType = SVGProps<SVGSVGElement>;


export function Users(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#18BFFF" />
      <ellipse
        cx={25.7511}
        cy={22.4998}
        rx={4.33333}
        ry={4.33333}
        fill="#fff"
      />
      <ellipse
        cx={25.7511}
        cy={34.4178}
        rx={7.58333}
        ry={4.33333}
        fill="#fff"
      />
      <path
        d="M38.75 34.417c0 1.795-2.206 3.25-4.898 3.25.793-.867 1.339-1.955 1.339-3.248 0-1.295-.547-2.384-1.342-3.252 2.693 0 4.9 1.455 4.9 3.25zM35.5 22.501a3.25 3.25 0 01-4.364 3.054 6.163 6.163 0 00.805-3.055c0-1.11-.293-2.152-.804-3.053A3.25 3.25 0 0135.5 22.5z"
        fill="#fff"
      />
    </svg>
  );
}

export function RiskScore(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#FF9F40" />
      <path
        d="M29 18v14M29 32l4 4M29 32l-4 4"
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={29} cy={42} r={2} fill="#fff" />
    </svg>
  );
}

export function TotalRecords(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#4BC0C0" />
      <path
        d="M18 20h22v18H18z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M22 24h14M22 28h10M22 32h6"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AvgScore(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#9966FF" />
      <path
        d="M18 36l6-6 5 5 11-11"
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HighestRisk(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#FF6384" />
      <path
        d="M29 16l3.09 9.51H42l-7.545 5.48L36.18 40 29 33.94 21.82 40l1.725-8.99L16 25.51h9.91L29 16z"
        fill="#fff"
      />
    </svg>
  );
}
