import React from 'react';
import styles from './Gallery.module.css';
import { ApodEntry } from '../ApodAPI';
import Loader from '../Loader/Loader';


// Функция, которая сдвигает значение месяца в допускаемое значение
// в выбранном году
const ClampMonthByYear = (year: number, month: number) => {
  const today = new Date();
  const monthMin = (year === 1995) ? 5 : 0;
  const monthMax = (year === today.getFullYear()) ? today.getMonth() : 11;
  return Math.min(Math.max(month, monthMin), monthMax);
}

// Функция для получения массива доступных для скачивания 
// месяцов в выбранном году
const GetAvailableMonthsByYear = (year: number
): Array<{ value: number, name: string }> => {
  // Массив всех возможных месяцов
  const monthArray = [
    { value: 0, name: "January" },
    { value: 1, name: "February" },
    { value: 2, name: "March" },
    { value: 3, name: "April" },
    { value: 4, name: "May" },
    { value: 5, name: "June" },
    { value: 6, name: "July" },
    { value: 7, name: "August" },
    { value: 8, name: "September" },
    { value: 9, name: "October" },
    { value: 10, name: "November" },
    { value: 11, name: "December" },
  ];

  const today = new Date();
  const monthMin = (year === 1995) ? 5 : 0;
  const monthMax = (year === today.getFullYear()) ? today.getMonth() : 11;

  return monthArray.filter((item, index) => (index <= monthMax && index >= monthMin));
}


export function Gallery(props: {
  selectedDate: Date,
  galleryArray: Array<ApodEntry>
  onApodChange: (date: Date) => void
  onYearMonthChange: (month: number, year: number) => void
}) {

  const [state, setState] = React.useState<'loading' | 'idle'>('loading');
  const [months, setMonths] = React.useState(
    GetAvailableMonthsByYear(props.selectedDate.getFullYear())
  );
  const years = [...Array(new Date().getFullYear() - 1994).keys()].map((i) => ((i + 1995).toString()));
  const [selectedYear, setSelectedYear] = React.useState(props.selectedDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState(props.selectedDate.getMonth());

  React.useEffect(() => {
    const year = props.selectedDate.getFullYear();
    const month = ClampMonthByYear(year, props.selectedDate.getMonth());

    setSelectedYear(year);
    setSelectedMonth(month);
    setMonths(GetAvailableMonthsByYear(year));
  }, [props.selectedDate]);

  React.useEffect(() => {
    setState('idle');
  }, [props.galleryArray]);

  // Функция для обновления просматриваемого месяца
  const setMonth = (month: number) => {
    setState('loading');
    // Передавать родителю новый месяц
    props.onYearMonthChange(month, selectedYear);

    setSelectedMonth(month);
  }

  // Функция для обновления просматриваемого года
  const setYear = (year: number) => {
    setState('loading');
    // Передавать родителю новый год
    props.onYearMonthChange(
      ClampMonthByYear(year, selectedMonth),
      year
    );

    setSelectedYear(year);
    setSelectedMonth(ClampMonthByYear(year, selectedMonth));
    setMonths(GetAvailableMonthsByYear(year));
  }


  return (
    <div className={styles.gallery}>

      <hr className={styles.hr} />

      <div className={styles.selection}>
        <select
          className={styles.select}
          value={selectedMonth}
          onChange={(e) => {
            setMonth(parseInt(e.target.value));
          }}
          disabled={state === 'loading'}
        >
          Month
          {months.map((item, index) =>
            <option value={item.value} key={index}>
              {item.name}
            </option>
          )}
        </select>
        <select
          className={styles.select}
          value={selectedYear}
          onChange={(e) => {
            setYear(parseInt(e.target.value));
          }}
          disabled={state === 'loading'}
        >
          Year
          {years.map((item, index) =>
            <option value={item} key={index}>
              {item}
            </option>
          )}
        </select>
      </div>

      <hr className={styles.hr} />

      {state === 'loading' && <Loader />}
      {state === 'idle' && (
        <div className={styles.grid}>
          {props.galleryArray.map((item, index) =>
            <div
              id={item.date}
              className={styles.item + ' ' + styles.inactive}
              key={index}
              title={item.title}
              onClick={() => {
                props.onApodChange(new Date(item.date));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                className={styles.itemImg}
                src={item.media_type === 'image' ? item.url : item.thumbnail_url || 'black.png'}
                alt={item.title}
                onLoad={() => {
                  document.getElementById(item.date)!.classList.remove(styles.inactive)
                }}
              />
              <div>
                {item.date.substring(
                  item.date.charAt(item.date.length - 2) === "0" ? 9 : 8,
                  10
                )}
              </div>

              {item.media_type === "video" && (
                <img
                  className={styles.youtubeLogo}
                  src='youtube_logo.png'
                  alt='video logo'
                ></img>
              )}
            </div>
          )}
        </div>)
      }
    </div>
  )
}
