// RectangleTable.jsx

const RectangleTable = ({ capacity, strokeColor, chairColor }) => {
  const chairWidth = 20;
  const chairHeight = 15;
  const chairRadius = 3;
  const strokeWidth = 2;
  const dashArray = "8,4";
  const tableStrokeWidth = 3;
  const tableDashArray = "10,5";

  const tableWidth = 120;
  const tableHeight = 80;
  const tableX = 40;
  const tableY = 60;
  const chairGap = 15;

  const chairs = [];

  if (!capacity || capacity <= 0) {
    return null;
  }

  // Better distribution logic
  const longSideChairs = Math.ceil(capacity * 0.4); // 40% on long sides
  const shortSideChairs = Math.floor(
    (capacity - longSideChairs * 2) / 2
  );

  let remaining = capacity;

  // 🔹 TOP (Long Side)
  const topChairs = Math.min(longSideChairs, remaining);
  for (let i = 0; i < topChairs; i++) {
    const spacing = tableWidth / (topChairs + 1);
    chairs.push(
      <rect
        key={`top-${i}`}
        x={tableX + spacing * (i + 1) - chairWidth / 2}
        y={tableY - chairGap - chairHeight}
        width={chairWidth}
        height={chairHeight}
        rx={chairRadius}
        fill={chairColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
      />
    );
  }
  remaining -= topChairs;

  // 🔹 RIGHT (Short Side)
  const rightChairs = Math.min(shortSideChairs, remaining);
  for (let i = 0; i < rightChairs; i++) {
    const spacing = tableHeight / (rightChairs + 1);
    chairs.push(
      <rect
        key={`right-${i}`}
        x={tableX + tableWidth + chairGap}
        y={tableY + spacing * (i + 1) - chairWidth / 2}
        width={chairHeight}
        height={chairWidth}
        rx={chairRadius}
        fill={chairColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
      />
    );
  }
  remaining -= rightChairs;

  // 🔹 BOTTOM (Long Side)
  const bottomChairs = Math.min(longSideChairs, remaining);
  for (let i = 0; i < bottomChairs; i++) {
    const spacing = tableWidth / (bottomChairs + 1);
    chairs.push(
      <rect
        key={`bottom-${i}`}
        x={tableX + spacing * (i + 1) - chairWidth / 2}
        y={tableY + tableHeight + chairGap}
        width={chairWidth}
        height={chairHeight}
        rx={chairRadius}
        fill={chairColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
      />
    );
  }
  remaining -= bottomChairs;

  // 🔹 LEFT (Short Side)
  const leftChairs = remaining;
  for (let i = 0; i < leftChairs; i++) {
    const spacing = tableHeight / (leftChairs + 1);
    chairs.push(
      <rect
        key={`left-${i}`}
        x={tableX - chairGap - chairHeight}
        y={tableY + spacing * (i + 1) - chairWidth / 2}
        width={chairHeight}
        height={chairWidth}
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
      <rect
        x={tableX}
        y={tableY}
        width={tableWidth}
        height={tableHeight}
        rx={8}
        fill="white"
        stroke={strokeColor}
        strokeWidth={tableStrokeWidth}
        strokeDasharray={tableDashArray}
      />
    </svg>
  );
};

export default RectangleTable;