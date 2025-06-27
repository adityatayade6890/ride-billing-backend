
module.exports = function calculateFare(distance, nightCharge, toll) {
  const baseRate = 12; // ₹ per KM
  let fare = distance * baseRate;

  if (nightCharge) fare += 300;
  if (toll) fare += toll;

  return Math.round(fare);
};
