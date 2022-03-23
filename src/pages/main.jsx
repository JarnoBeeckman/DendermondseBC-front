import KeuzeMenu from "../components/KeuzeMenu";
import logo from '../img/logoBC.jpg'

export default function Main() {
    return (
        <div className="limit">
            <div className="cntr">
                <div className="wrapper">
                    <img src={logo} alt="logo"/>
                    <KeuzeMenu view={'main'}/>
                </div>
            </div>
        </div>
    )
}
