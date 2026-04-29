// SquareTable.jsx
const SquareTable = ({ capacity, strokeColor, chairColor }) => {
  const chairWidth = 20;
  const chairHeight = 15;
  const chairRadius = 3;
  const strokeWidth = 2;
  const dashArray = "8,4";
  const tableStrokeWidth = 3;
  const tableDashArray = "10,5";

  const tableSize = 100;
  const tableX = 50;
  const tableY = 50;
  const chairGap = 15;

  const chairs = [];
  const chairsPerSide = Math.ceil(capacity / 4);

  const renderSide = (count, side) => {
    for (let i = 0; i < count; i++) {
      const spacing = tableSize / (count + 1);

      let x, y, width, height;

      switch (side) {
        case "top":
          x = tableX + spacing * (i + 1) - chairWidth / 2;
          y = tableY - chairGap - chairHeight;
          width = chairWidth;
          height = chairHeight;
          break;
        case "right":
          x = tableX + tableSize + chairGap;
          y = tableY + spacing * (i + 1) - chairWidth / 2;
          width = chairHeight;
          height = chairWidth;
          break;
        case "bottom":
          x = tableX + spacing * (i + 1) - chairWidth / 2;
          y = tableY + tableSize + chairGap;
          width = chairWidth;
          height = chairHeight;
          break;
        case "left":
          x = tableX - chairGap - chairHeight;
          y = tableY + spacing * (i + 1) - chairWidth / 2;
          width = chairHeight;
          height = chairWidth;
          break;
        default:
          break;
      }

      chairs.push(
        <rect
          key={`${side}-${i}`}
          x={x}
          y={y}
          width={width}
          height={height}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />
      );
    }
  };

  let remaining = capacity;

  const top = Math.min(chairsPerSide, remaining);
  renderSide(top, "top");
  remaining -= top;

  const right = Math.min(chairsPerSide, remaining);
  renderSide(right, "right");
  remaining -= right;

  const bottom = Math.min(chairsPerSide, remaining);
  renderSide(bottom, "bottom");
  remaining -= bottom;

  renderSide(remaining, "left");

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {chairs}
      <rect
        x={tableX}
        y={tableY}
        width={tableSize}
        height={tableSize}
        rx={8}
        fill="white"
        stroke={strokeColor}
        strokeWidth={tableStrokeWidth}
        strokeDasharray={tableDashArray}
      />
    </svg>
  );
};

export default SquareTable;