import { memo } from "react"
import logo from '../img/logoBC.jpg'

export default function Wrapper({children}) {
    const Ee = memo(()=>{
        return (
            <div className="limit">
                <div className="cntr">
                    <div className="wrapper">
                        <img src={logo} alt="logo"/>
                        {children}
                    </div>
                </div>
            </div>
        )
    })
   return <Ee/>
}