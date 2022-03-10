import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import Main from './pages/main';
import Login from './pages/login'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Switch>
        <Route exact path='/login'><Login /></Route>
        <Route exact path='/DendermondseBC-front'><Redirect to='/' /></Route>
        <PrivateRoute exact path='/'><Main /></PrivateRoute>
      </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
