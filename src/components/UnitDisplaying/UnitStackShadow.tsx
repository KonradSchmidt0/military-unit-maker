interface Props {
  stack: number;
  color: string;
  style: React.CSSProperties;
}

export function UnitStackShadow(p: Props) {
  const shadows = [];

  for (let i = p.stack; i > 0; i--) {
    shadows.push(
      <img
        key={i + "shadow"}
        src={process.env.PUBLIC_URL + "/icons/b-frame.svg"}
        className="absolute !w-14 saturate-[50%] brightness-50 -z-50"
        alt="stack"
        style={{
          backgroundColor: p.color,
          top: (i) * 6,
          left: (i) * 6,
          ...p.style
        }}
      />
    );
  }

  return <>{shadows}</>;
}
