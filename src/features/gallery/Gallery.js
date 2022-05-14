import React, { useEffect } from "react";
import styles from "./Gallery.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setContent, setSelectedDate } from "../../APOD/apodSlice";
import {
  getApodMonthAsync,
  setSelectedMonth,
  setSelectedYear,
} from "./gallerySlice";
import Loader from "../loader/Loader";
import youtube_logo from "../../youtube_logo.png";

function Gallery() {
  const dispatch = useDispatch();

  const status = useSelector((state) => state.gallery.status);
  const gridItems = useSelector((state) => state.gallery.gridItems);
  const selectedMonth = useSelector((state) => state.gallery.selectedMonth);
  const selectedYear = useSelector((state) => state.gallery.selectedYear);
  const monthArray = useSelector((state) => state.gallery.monthArray);
  const yearArray = useSelector((state) => state.gallery.yearArray);

  useEffect(() => {
    dispatch(getApodMonthAsync({ month: selectedMonth, year: selectedYear }));
  }, [selectedMonth, selectedYear]);

  return (
    <div className={styles.gallery}>
      <div className={styles.selection}>
        <select
          value={selectedMonth}
          onChange={(e) => {
            dispatch(setSelectedMonth(parseInt(e.target.value)));
          }}
        >
          Month
          {monthArray.map((item, index) => (
            <option value={index} key={index}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => {
            dispatch(setSelectedYear(parseInt(e.target.value)));
          }}
        >
          Year
          {yearArray.map((item, index) => (
            <option value={index + 1996} key={index}>
              {item}
            </option>
          ))}
        </select>
      </div>
      {status === "idle" && (
        <div className={styles.grid}>
          {gridItems.map((item, index) => (
            <div
              className={styles.item}
              key={index}
              onClick={() => {
                dispatch(setContent(item));
              }}
              title={item.title}
            >
              <img
                src={item.media_type === "image" ? item.url : item.thumbnail_url}
                className={styles.itemImg}
                alt={item.title}
              ></img>
              <div>{item.date.substring(index >= 9 ? 8 : 9, 10)}</div>
              {item.media_type === "video" && (
                <img
                  className={styles.youtubeLogo}
                  src={youtube_logo}
                  alt="video logo"
                ></img>
              )}
            </div>
          ))}
        </div>
      )}
      {status === "loading" && (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Gallery;
