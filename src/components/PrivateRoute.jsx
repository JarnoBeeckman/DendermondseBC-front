import { useLocation,Route,Redirect } from "react-router-dom";
import { useSession } from "../context/AuthProvider"

export default function PrivateRoute({children,...rest}) {
    const {isAuthed} = useSession();
    const {pathname} = useLocation();
    return (
        <Route {...rest}>
            {
                isAuthed ? (children) : (<Redirect from={pathname} to="/login"/>)
            }
        </Route>
    )
}