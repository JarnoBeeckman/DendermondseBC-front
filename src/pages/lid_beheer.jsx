import logo from '../img/logoBC.jpg'
import LidBeheer from '../components/beheerLid'


export default function LedenBeheer() {
    
    return (
        <div className="limit">
            <div className="cntr">
                <div className="wrapper">
                    <img src={logo} alt="logo"/>
                    <LidBeheer />
                </div>
            </div>
        </div>
    )
}