export function calculateLeaveDays(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - startDate.getTime();

  if (diffTime < 0) {
    throw new Error("End date must be after start date");
  }

  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays + 1;
}
