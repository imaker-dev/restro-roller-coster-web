// DynamicTableShape.jsx

import RectangleTable from "./RectangleTable";
import RoundTable from "./RoundTable";
import SquareTable from "./SquareTable";

const DynamicTableShape = ({ shape, status, capacity }) => {
  const isBooked = status === "booked";
  const isOccupied = status === "occupied";
  const isRunning = status === "running";

  let strokeColor, chairColor;

  if (isBooked) {
    strokeColor = "#c084fc";
    chairColor = "#e9d5ff";
  } else if (isOccupied) {
    strokeColor = "#fb923c";
    chairColor = "#fed7aa";
  } else if (isRunning) {
    strokeColor = "#38bdf8";
    chairColor = "#bae6fd";
  } else {
    strokeColor = "#22c55e";
    chairColor = "#bbf7d0";
  }

  const commonProps = {
    capacity,
    strokeColor,
    chairColor,
  };

  switch (shape) {
    case "round":
      return <RoundTable {...commonProps} />;
    case "square":
      return <SquareTable {...commonProps} />;
    case "rectangle":
      return <RectangleTable {...commonProps} />;
    default:
      return null;
  }
};

export default DynamicTableShape;
