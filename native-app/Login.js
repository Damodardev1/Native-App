import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:6363/api/login', {
        username: username,
        password: password,
      });
      if (response.data.success) {
        setMessage('Login successful.');
        localStorage.setItem('token', response.data.token);
        // Redirect to /companies after successful login
        window.location.href = '/companies';
      } else {
        setMessage('Incorrect username or password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Login form fields */}
    </form>
  );
};

const CompaniesPage = () => {
  return (
    <div>
      {/* Companies page content */}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/companies" component={CompaniesPage} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
};

export default App;
