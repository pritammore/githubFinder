import React, {Component, Fragment} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/layout/Navbar';
import Alert from './Components/layout/Alert';
import Users from './Components/users/Users';
import User from './Components/users/User';
import Search from './Components/users/Search';
import About from './Components/pages/About';
import PropTypes from 'prop-types';
import './App.css';

class App extends Component {
  state = {
      users: [],
      repos: [],
      user: {},
      loading: false,
      alert: null
  }

  // async componentDidMount() {
  //     this.setState({ loading: true });
  //     const res = await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`);      
  //     this.setState({ users: res.data, loading: false });
  // }  

  static propsTypes = {
    searchUsers: PropTypes.func.isRequired,
    clearUsers: PropTypes.func.isRequired,
    showClear: PropTypes.bool.isRequired,
    showAlert: PropTypes.func.isRequired
  };

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type }});

    setTimeout(() => {
      this.setState({alert: null});
    }, 5000);
  }

  searchUsers = async (text) => {

      this.setState({ loading: true });
      const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`);      
      this.setState({ users: res.data.items, loading: false });
  };

  // Get user detail from Github
  getUser = async (username) => {

    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`);      
    this.setState({ user: res.data, loading: false });

  }

  // Get user repos from Github
  getUserRepos = async (username) => {

    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`);
    this.setState({ repos: res.data, loading: false });

  }
  
  clearUsers = () => this.setState({ users: [], loading: false });

  render() {
    const { loading, user, repos, users } = this.state;

    return (
      <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Alert alert={this.state.alert} />
          <Switch>
            <Route exact path='/' render={props => (
              <Fragment>
                <Search
                    searchUsers={this.searchUsers}
                    clearUsers={this.clearUsers}
                    showClear={users.length > 0 ? true: false}
                    setAlert={this.setAlert} />
                <Users loading={loading} users={users} />
              </Fragment>
            )} />
            <Route exact path='/about' component={About} />
            <Route path='/user/:login' render={props => (
              <User 
                {...props} 
                getUser={this.getUser}
                getUserRepos={this.getUserRepos}
                user={user}
                repos={repos}
                loading={loading} />
            )} />
          </Switch>
        </div>
      </div>
      </Router>
    );
  }
  
}

export default App;
