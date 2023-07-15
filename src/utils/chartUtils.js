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
  const MAX_CHANNEL_VALUE = 200; // Maximum value for each color channel
  let color = "#";
  
  for (let i = 0; i < 3; i++) {
    const channelValue = Math.floor(Math.random() * (MAX_CHANNEL_VALUE + 1));
    const hex = channelValue.toString(16).padStart(2, "0"); // Convert the value to a 2-digit hexadecimal string
    color += hex;
  }
  
  return color;
}