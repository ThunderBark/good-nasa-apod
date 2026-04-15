import { Outlet, RouteObject, createBrowserRouter, redirect, useOutletContext } from 'react-router-dom';
import { Apod, ApodLoader } from '../Apod/Apod';
import styles from './App.module.css';
import 'minireset.css';
import React from 'react';


type LoadingContext = {
  isLoading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
};

export const useLoading = () => {
  return useOutletContext<LoadingContext>();
}

const AppLayout = () => {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className={styles.app}>
      <main className={styles.main_container}>
        <Outlet context={{
          isLoading: loading,
          setLoading: setLoading
        } satisfies LoadingContext} />
      </main>
    </div>
  );
}

export const App = createBrowserRouter([{
  element: <AppLayout />,
  children: [
    {
      path: '/good-nasa-apod/:date?',
      element: <Apod />,
      loader: ApodLoader,
    },
  ],
}]);
