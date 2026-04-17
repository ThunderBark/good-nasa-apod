import React from 'react';
import styles from './Apod.module.css';
import { Gallery } from './Gallery/Gallery';
import { ApodEntry, ApodResponse } from './ApodAPI';
import { LoaderFunctionArgs, redirect, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getApodForMonth } from './ApodActions';
import { StarsBackground } from './StarsBackground/StarsBackground';
import { Showcase } from './Showcase/Showcase';
import Loader from './Loader/Loader';


function IsApodDateValid(date: string | undefined): string | undefined {
  if (date === undefined) {
    return undefined;
  }

  if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return undefined;
  }

  if (isNaN(Date.parse(date))) {
    return undefined;
  }

  const request = new Date(date).getTime();
  const today = new Date().getTime();
  const begin = new Date("1995-06-16").getTime();
  if (request < begin || request > today) {
    return undefined;
  }

  return date;
}


const getBasePath = () => {
  return "/good-nasa-apod/";
}


export const ApodLoader = (url: LoaderFunctionArgs<any>) => {
  if (!url.params.hasOwnProperty('date') || url.params.date === undefined) {
    return redirect(getBasePath() + new Date().toISOString().substring(0, 10));
  }

  const apodDateString = IsApodDateValid(url.params.date);
  if (!apodDateString) {
    return redirect(getBasePath() + new Date().toISOString().substring(0, 10));
  }

  return new Date(apodDateString);
}


export function Apod() {
  const params = useParams<{ date: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [apodArray, setApodArray] = React.useState(new Array<ApodEntry>());
  const [selectedDate, setSelectedDate] = React.useState(new Date("1970-01-01"));
  const [selectedApod, setSelectedApod] = React.useState({} as ApodEntry);

  const [isShowingStars, setShowingStars] = React.useState(false);
  const [tooManyRequests, setTooManyRequests] = React.useState(false);


  React.useEffect(() => {
    const newDate = new Date(params.date!);

    // Если дата прошлого запроса данных входила в тот же месяц, значит данные у нас есть
    if (
      selectedDate.getFullYear() === newDate.getFullYear() &&
      selectedDate.getMonth() === newDate.getMonth()
    ) {
      const apod = apodArray.find(
        (item) => (new Date(item.date).toDateString() === newDate.toDateString())
      ) || apodArray[apodArray.length - 1];

      setSelectedApod(apod);
      setSelectedDate(newDate);
      return;
    }

    // Если дошли сюда, то данных нет - надо запрашивать
    getApodForMonth(
      newDate.getMonth(),
      newDate.getFullYear(),
    )
      .then((value: ApodResponse) => {
        // Пытаемся найти APOD за запрошенную дату или просто выдаем последний элемент
        const apod = value.find(
          (item) => (new Date(item.date).toDateString() === newDate.toDateString())
        ) || value[value.length - 1];

        // Выставляем актуальную дату и сохраняем массив картинок
        setApodArray(value);
        setSelectedApod(apod);
        setSelectedDate(newDate);
      })
      .catch((response: Response) => {
        if (response.status == 429) {
          setTooManyRequests(true)
        } else {
          console.error("Forbidden rror!")
        }
      });
  }, [location]);


  // Колбэк для галереи для изменения текущего отображаемого APOD
  const changeApod = React.useCallback((date: Date) => {
    navigate(getBasePath() + date.toISOString().substring(0, 10));
  }, []);

  const loadMonthYear = React.useCallback((month: number, year: number) => {
    // Обновляем галерею
    getApodForMonth(
      month,
      year,
    )
      .then((value: ApodResponse) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(month);
        newDate.setFullYear(year);
        setSelectedDate(newDate);

        // Сохраняем массив картинок
        setApodArray(value);
      })
      .catch((response: Response) => {
        if (response.status == 429) {
          setTooManyRequests(true)
        } else {
          console.error("Error!")
        }
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <StarsBackground />

      {!isShowingStars && !tooManyRequests &&
        selectedApod?.media_type === "image" && (
          <Showcase
            apod={selectedApod}
            onClick={() => { window.open(selectedApod.hdurl) }}
          />
        )}
      {!isShowingStars && !tooManyRequests && selectedApod?.media_type === "video" && (
        <div className={styles.videoWrapper}>
          {selectedApod?.thumbnail_url && (
            <iframe
              className={styles.video}
              src={selectedApod.url}
              allowFullScreen
              title={selectedApod.title}
            >
              video
            </iframe>
          )}
          {!selectedApod?.thumbnail_url && (
            <video
              className={styles.video}
              src={selectedApod.url}
              title={selectedApod.title}
              controls
            >
              video
            </video>
          )}
          <div className={styles.videoContent}>
            <h2>{selectedApod.title}</h2>
            <p>
              By {selectedApod.copyright}, {selectedApod.date}
            </p>
            <div>{selectedApod.explanation}</div>
          </div>
        </div>
      )}
      {!isShowingStars && !tooManyRequests && !selectedApod?.media_type && <Loader />}

      {!isShowingStars && !tooManyRequests &&
        <Gallery
          selectedDate={selectedDate}
          galleryArray={apodArray}
          onApodChange={changeApod}
          onYearMonthChange={loadMonthYear}
        />
      }

      {!isShowingStars && tooManyRequests && (
        <div style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",  // horizontal
          alignItems: "center",      // vertical
          fontSize: "2rem",
        }}>That's it for today! See you tomorrow!</div>
      )}

      <img
        className={styles.hideButton}
        onClick={() => setShowingStars(!isShowingStars)}
        src='icons8-stars-96.png'
      />
    </div>
  )
}
