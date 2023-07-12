// chartUtils.js
import moment from "moment";

export function getLegendName(measure) {

  // Customize the legend name for each measure
  if (measure === "Orders.number") {
    return "Completed Orders";
  } 
  else if (measure === "Users.count") {
    return "Users";
  } else if (measure === "Orders.count") {
    return "Orders";
  } 
  else {
    return measure; // Fallback to the original measure name
  }
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

