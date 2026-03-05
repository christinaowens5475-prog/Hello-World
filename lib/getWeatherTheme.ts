export function getWeatherTheme(code: number): string {
  if (code >= 200 && code <= 232) {
    // Thunderstorm — dark blue
    return "bg-gradient-to-br from-blue-900 to-indigo-900";
  }
  if (code >= 300 && code <= 321) {
    // Drizzle — medium blue
    return "bg-gradient-to-br from-blue-500 to-blue-700";
  }
  if (code >= 500 && code <= 531) {
    // Rain — medium-dark blue
    return "bg-gradient-to-br from-blue-600 to-blue-900";
  }
  if (code >= 600 && code <= 622) {
    // Snow — light grey
    return "bg-gradient-to-br from-gray-100 to-gray-300";
  }
  if (code >= 700 && code <= 781) {
    // Atmosphere / fog — medium grey
    return "bg-gradient-to-br from-gray-400 to-gray-600";
  }
  if (code === 800) {
    // Clear / sunny — yellow-orange
    return "bg-gradient-to-br from-yellow-300 to-orange-300";
  }
  if (code >= 801 && code <= 804) {
    // Cloudy — light to dark grey
    return "bg-gradient-to-br from-gray-300 to-gray-500";
  }
  // Fallback
  return "bg-gradient-to-br from-gray-400 to-gray-600";
}
