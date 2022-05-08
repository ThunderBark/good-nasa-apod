import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Gallery from "../features/gallery/Gallery";
import Loader from "../features/loader/Loader";
import styles from "./Apod.module.css";
import { getApodAsync } from "./apodSlice";

function Apod() {
  const status = useSelector((state) => state.apod.status);
  const title = useSelector((state) => state.apod.title);
  const date = useSelector((state) => state.apod.date);
  const url = useSelector((state) => state.apod.url);
  const hdurl = useSelector((state) => state.apod.hdurl);
  const author = useSelector((state) => state.apod.author);
  const description = useSelector((state) => state.apod.descr);
  const selectedDate = useSelector((state) => state.apod.selectedDate);
  const mediaType = useSelector((state) => state.apod.mediaType);

  const dispatch = useDispatch();

  // FIXME: из-за useEffect эти запросы отправляются по 3 раза. Найти лучше место для инициализации
  useEffect(() => {
    dispatch(getApodAsync(selectedDate));
  }, [selectedDate]);
  // TODO: вообще надо обрабатывать случаи когда NASA присылает не фотографии, там могут быть и видео
  return (
    <div className={styles.wrapper}>
      {mediaType === "image" && status === "idle" && (
        <div className={styles.imgWrapper}>
          <img className={styles.image} src={url} alt=""></img>
          <a className={styles.descrLink} href={hdurl} target="_blank" rel="noreferrer">
            <div className={styles.content}>
              <div className={styles.title}>
                <h2>{title}</h2>
                <p>
                  By {author}, {date}
                </p>
              </div>
              <div className={styles.description}>{description}</div>
            </div>
          </a>
        </div>
      )}
      {mediaType === "video" && status === "idle" && (
        <div className={styles.videoWrapper}>
          <iframe
            width="100%"
            height="100%"
            src={url}
            frameBorder="0"
            allowFullScreen
            title={title}
          >
            video
          </iframe>
          <div className={styles.videoContent}>
            <h2>{title}</h2>
            <p>
              By {author}, {date}
            </p>
            <div>{description}</div>
          </div>
        </div>
      )}
      {status === "loading" && <Loader />}
      <Gallery />
    </div>
  );
}

export default Apod;
