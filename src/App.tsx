import React from 'react';
import logo from './logo.svg';
import './App.css';
import GlobalStyles from './styles/globals'
import { ApiContextProvider } from './context/ApiContext';
import MainPage from './page/MainPage';

function App() {
  return (<ApiContextProvider>
    <>
      <MainPage />
      <GlobalStyles />
    </>


  </ApiContextProvider>
  );
}

export default App;
