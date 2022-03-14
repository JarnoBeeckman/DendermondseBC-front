import logo from '../img/logoBC.jpg'
import AccountGegevens from '../components/accountGegevens'

export default function AccountBeheren() {
    return (
        <div className="limit">
            <div className="cntr">
                <div className="wrapper">
                    <img src={logo} alt="logo"/>
                    <AccountGegevens />
                </div>
            </div>
        </div>
    )
}