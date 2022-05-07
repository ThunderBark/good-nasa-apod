export function fetchDate(date = "2022-1-1") {
  return fetch(
    "https://api.nasa.gov/planetary/apod?" +
      new URLSearchParams({
        api_key: process.env.REACT_APP_NASA_API_KEY
          ? process.env.REACT_APP_NASA_API_KEY
          : "DEMO_KEY",
        date: date,
        thumbs: true,
      })
  );
}
