export type ApodEntry = {
  resource?: any, //?
  concept_tags: boolean,
  title: string,
  date: string,
  url: string,
  hdurl: string,
  media_type: 'image' | 'video',
  explanation: string,
  concepts?: any //?
  thumbnail_url?: string,
  copyright: string,
  service_version: string
};

export type ApodResponse = Array<ApodEntry>;

export async function fetchDateRange(
  firstDay = "2000-01-01",
  lastDay = "2000-02-01",
) {
  return fetch(
    "https://api.nasa.gov/planetary/apod?" +
      new URLSearchParams([
        ["api_key", import.meta.env.VITE_NASA_API_KEY],
        ["start_date", firstDay.toString()],
        ["end_date", lastDay.toString()],
        ["thumbs", "true"],
      ])
  )
  .then((response: Response) => {
      if (!response.ok) {
        throw Error("Can't load data!");
      }
      return response.json()
    }
  );
}