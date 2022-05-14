import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { fetchDate } from "./apodAPI";

const initialState = {
  status: "idle",
  url: "",
  hdurl: "",
  title: "test title",
  author: "test author",
  date: "test date",
  selectedDate: new Date().toISOString().substring(0, 10),
  descr: "test descr",
  mediaType: "",
};

export const getApodAsync = createAsyncThunk("apod/fetchDate", async (date) => {
  const response = await fetchDate(date);
  if (response.status === 429) {
    toast.error("Too many pictures for you today, see you tomorrow!");
  } else if (!response.ok) {
    toast.error(response.status + ": " + response.statusText);
  }
  // The value we return becomes the `fulfilled` action payload
  return response.json();
});

export const apodSlice = createSlice({
  name: "apod",
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setApodContent: (state, action) => {
      state.status = "idle";
      state.url = action.payload.url;
      state.hdurl = action.payload.hdurl;
      state.date = action.payload.date;
      state.title = action.payload.title;
      state.author = action.payload.copyright
        ? action.payload.copyright
        : "NASA";
      state.descr = action.payload.explanation;
      state.mediaType = action.payload.media_type;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getApodAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getApodAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.url = action.payload.url;
        state.hdurl = action.payload.hdurl;
        state.date = action.payload.date;
        state.title = action.payload.title;
        state.author = action.payload.copyright
          ? action.payload.copyright
          : "NASA";
        state.descr = action.payload.explanation;
        state.mediaType = action.payload.media_type;
      });
  },
});

export const { setSelectedDate, setApodContent } = apodSlice.actions;

export default apodSlice.reducer;
