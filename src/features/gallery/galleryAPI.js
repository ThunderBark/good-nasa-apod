export function fetchDateRange(
  firstDay = "2000-01-01",
  lastDay = "2000-02-01"
) {
  return fetch(
    "https://api.nasa.gov/planetary/apod?" +
      new URLSearchParams({
        api_key: process.env.REACT_APP_NASA_API_KEY
          ? process.env.REACT_APP_NASA_API_KEY
          : "DEMO_KEY",
        start_date: firstDay,
        end_date: lastDay,
        thumbs: true,
      })
  );
}
