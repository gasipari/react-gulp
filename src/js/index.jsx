import React from 'react'
import { render, findDOMNode } from 'react-dom'
import { Router, Route, Link, History } from 'react-router'
import { createHistory, useBasename } from 'history'
import auth from './auth'

const history = useBasename(createHistory)({
  basename: '/demoapp'
})

var App = React.createClass({
  getInitialState() {
    return {
      loggedIn: auth.loggedIn()
    }
  },

  updateAuth(loggedIn) {
    this.setState({
      loggedIn: loggedIn
    })
  },

  componentWillMount() {
    auth.onChange = this.updateAuth
    auth.login()
  },

  render() {
    return (
      <div>
        <ul>
          <li>
            {this.state.loggedIn ? (
              <Link to="/logout">Log out</Link>
            ) : (
              <Link to="/login">Sign in</Link>
            )}
          </li>
          <li><Link to="/forward-sold">Forward Sold</Link>(authenticated)</li>
          <li><Link to="/scenario-forecast">Scenario Forecast</Link> (authenticated)</li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})

var ScenarioForecast = React.createClass({
  render() {
    var token = auth.getToken()

    return (
      <div>
        <h1>Scenario Forecast</h1>
        <p>{token}</p>
      </div>
    )
  }
})

var ForwardSold = React.createClass({
  render() {
    var token = auth.getToken()
    return <h1>Forward Sold</h1>
  }
})

var Login = React.createClass({
  mixins: [ History ],

  getInitialState() {
    return {
      error: false
    }
  },

  handleSubmit(event) {
    event.preventDefault()

    var email = findDOMNode(this.refs.email).value
    var pass = findDOMNode(this.refs.pass).value

    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn)
        return this.setState({ error: true })

      var { location } = this.props

      if (location.state && location.state.nextPathname) {
        this.history.replaceState(null, location.state.nextPathname)
      } else {
        this.history.replaceState(null, '/about')
      }
    })
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label><input ref="email" placeholder="email" defaultValue="joe@example.com" /></label>
        <label><input ref="pass" placeholder="password" /></label><br />
        <button type="submit">login</button>
        {this.state.error && (
          <p>Bad login information</p>
        )}
      </form>
    )
  }
})

var Logout = React.createClass({
  componentDidMount() {
    auth.logout()
  },

  render() {
    return <p>You are now logged out</p>
  }
})

function requireAuth(nextState, replaceState) {
  if (!auth.loggedIn())
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
}

render((
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="forward-sold" component={ForwardSold} onEnter={requireAuth} />
      <Route path="scenario-forecast" component={ScenarioForecast} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById('example'))