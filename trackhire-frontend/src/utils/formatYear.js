export function formatYear(year, course) {
  const suffixes = { 1: "st", 2: "nd", 3: "rd", 4: "th", 5: "th" };
  const num = parseInt(year, 10);

  let yearText = "";
  if (!isNaN(num) && num >= 1 && num <= 5) {
    yearText = `${num}${suffixes[num] || "th"} Year`;
  } else if (year) {
    yearText = year; // fallback: show whatever they typed if not a clean number
  }

  if (yearText && course) return `${yearText} ${course}`;
  if (yearText) return yearText;
  if (course) return course;
  return "Student";
}