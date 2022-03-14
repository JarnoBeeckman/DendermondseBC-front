import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import Main from './pages/main';
import Login from './pages/login'
import AccountBeheren from './pages/account_beheren';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Switch>
        <Route exact path='/login'><Login /></Route>
        <Route exact path='/DendermondseBC-front'><Redirect to='/' /></Route>
        <PrivateRoute exact path='/'><Main /></PrivateRoute>
        <PrivateRoute exact path='/accountBeheren'><AccountBeheren/></PrivateRoute>
        <PrivateRoute exact path='/kledijBestellen'></PrivateRoute>
        <PrivateRoute exact path='/onkosten'></PrivateRoute>
        <PrivateRoute exact path='/trainingsuren'></PrivateRoute>
        <PrivateRoute exact path='/aanwezigheden'></PrivateRoute>
        <PrivateRoute exact path='lidBeheer'></PrivateRoute>
        <PrivateRoute exact path='/stuurMail'></PrivateRoute>
        <PrivateRoute exact path='/aanpassenBV'></PrivateRoute>
        <PrivateRoute exact path='/vergoedingTrainers'></PrivateRoute>
        <PrivateRoute exact path='/onkostenKapitein'></PrivateRoute>
        <PrivateRoute exact path='/onkostenBestuur'></PrivateRoute>
        <PrivateRoute exact path='/beheerLeden'></PrivateRoute>
      </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
