import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import Login from './pages/public/login'
import AccountBeheren from './pages/account_beheren';
import WijzigWachtwoord from './pages/ww_edit';
import LedenBeheer from './pages/lid_beheer';
import AanpassingenBV from './pages/aanpassingenBV';
import GroepConfig from './pages/settings/groepConfig';
import Wrapper from './components/wrapper';
import KeuzeMenu from './components/KeuzeMenu';
import GroepBeheer from './pages/groepBeheer';
import BetalingConfig from './pages/settings/betalingConfig';
import Betalingen from './pages/betalingen';
import Mails from './pages/mails';
import NieuweLeden from './pages/nieuweLeden';
import Register from './pages/public/register';
import ForgotPassword from './pages/public/ww_vergeten';
import ExcelImport from './pages/excelImport';
import PrijsConfig from './pages/settings/prijsConfig';
import ImportConfig from './pages/settings/importConfig';
import ToPay from './pages/toPay';
import Rolconfig from './pages/settings/rolConfig';
import ResetPassword from './pages/public/ww_reset';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Switch>
        <Route exact path='/login'><Login /></Route>
        <Route exact path='/DendermondseBC-front'><Redirect to='/' /></Route>
        <Wrapper>
        <Route exact path='/wwVergeten'><ForgotPassword/></Route>
        <Route exact path='/register'><Register/></Route>
        <Route exact path='/reset'><ResetPassword/></Route>
        <PrivateRoute exact path='/'><KeuzeMenu view={'main'} /></PrivateRoute>
        <PrivateRoute exact path='/accountBeheren'><AccountBeheren/></PrivateRoute>
        <PrivateRoute exact path='/wijzigWachtwoord'><WijzigWachtwoord/></PrivateRoute>
        <PrivateRoute exact path='/lidBeheer'><LedenBeheer/></PrivateRoute>
        <PrivateRoute exact path='/stuurMail'><Mails/></PrivateRoute>
        <PrivateRoute exact path='/aanpassenBV'><AanpassingenBV/></PrivateRoute>
        <PrivateRoute exact path='/nieuweLeden'><NieuweLeden/></PrivateRoute>
        <PrivateRoute exact path='/settings'><KeuzeMenu view={'settings'}/></PrivateRoute>
        <PrivateRoute exact path='/groepConfig'><GroepConfig /></PrivateRoute>
        <PrivateRoute exact path='/groepBeheer'><GroepBeheer/></PrivateRoute>
        <PrivateRoute exact path='/betalingConfig'><BetalingConfig/></PrivateRoute>
        <PrivateRoute exact path='/betalingen'><Betalingen/></PrivateRoute>
        <PrivateRoute exact path='/excelImport'><ExcelImport /></PrivateRoute>
        <PrivateRoute exact path='/prijsConfig'><PrijsConfig/></PrivateRoute>
        <PrivateRoute exact path='/importConfig'><ImportConfig /></PrivateRoute>
        <PrivateRoute exact path='/toPay'><ToPay /></PrivateRoute>
        <PrivateRoute exact path='/rolConfig'><Rolconfig /></PrivateRoute>
        </Wrapper>
      </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
