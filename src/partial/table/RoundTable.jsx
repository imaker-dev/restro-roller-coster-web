// RoundTable.jsx
const RoundTable = ({ capacity, strokeColor, chairColor }) => {
  const chairWidth = 20;
  const chairHeight = 15;
  const chairRadius = 3;
  const strokeWidth = 2;
  const dashArray = "8,4";
  const tableStrokeWidth = 3;
  const tableDashArray = "10,5";

  const centerX = 100;
  const centerY = 100;
  const tableRadius = 50;
  const chairDistance = 75;

  const chairs = [];

  for (let i = 0; i < capacity; i++) {
    const angle = (i * 360) / capacity - 90;
    const angleRad = (angle * Math.PI) / 180;
    const chairX = centerX + chairDistance * Math.cos(angleRad);
    const chairY = centerY + chairDistance * Math.sin(angleRad);

    const isVertical =
      (angle >= -45 && angle < 45) || (angle >= 135 && angle < 225);

    chairs.push(
      <rect
        key={i}
        x={chairX - (isVertical ? chairHeight / 2 : chairWidth / 2)}
        y={chairY - (isVertical ? chairWidth / 2 : chairHeight / 2)}
        width={isVertical ? chairHeight : chairWidth}
        height={isVertical ? chairWidth : chairHeight}
        rx={chairRadius}
        fill={chairColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
      />
    );
  }

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {chairs}
      <circle
        cx={centerX}
        cy={centerY}
        r={tableRadius}
        fill="white"
        stroke={strokeColor}
        strokeWidth={tableStrokeWidth}
        strokeDasharray={tableDashArray}
      />
    </svg>
  );
};

export default RoundTable;