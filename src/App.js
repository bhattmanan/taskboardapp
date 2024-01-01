//import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Lists from './components/Lists';
import './styles.css'; // Import the CSS file

const App = () => {
  const userId = 1; // Replace with actual user ID after login

  return (
    <div className="container">
      <Login />
      <Register />
      {userId && <Lists userId={userId} />}
    </div>
  );
};

export default App;