import { configureStore } from '@reduxjs/toolkit';
import apodReducer from '../APOD/apodSlice';
import galleryReducer from '../features/gallery/gallerySlice';

export const store = configureStore({
  reducer: {
    apod: apodReducer,
    gallery: galleryReducer,
  },
});