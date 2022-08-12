import { useNavigate } from "react-router-dom";
import LogOut from "../auth/Logout";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <div>
        <nav className="navbar is-flex is-flex-row is-justify-content-space-between" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <span role="button" className="navbar-item is-clickable" onClick={() => navigate("/")}>
                    <i className="fa fa-shopping-bag fa-lg" aria-hidden="true"></i>
                </span>
                <h3 className="navbar-item title is-5">Shopping Cart</h3>
            </div>
            
            <div className="navbar-end">
                <div className="navbar-item">
                    <LogOut />
                </div>
            </div>
        </nav>
        <hr className="mt-0 mb-2"/>
        </div>
    )
}