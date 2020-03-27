import React from 'react';
import './App.css';
import CovidMap from './components/CovidMap';
import SideBar from './components/SideBar';
import {StoreProvider} from './store';

function App() {

  return (
    <StoreProvider>
      <div className="App">
        <SideBar/>
        <CovidMap />
      </div>
    </StoreProvider>
  );
}

export default App;
