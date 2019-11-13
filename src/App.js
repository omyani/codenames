import React from 'react';
import './App.css';
import Main from './pages/main';
import Image from './img/codenames.png';

const styles = {
  background: {
    width: "100%",
    height: "800px",
    backgroundImage: `url(${Image})`
  }
};

function App() {
  return (
    <div className="App" style={styles.background}>
       <Main/>
    </div>
  );
}

export default App;
