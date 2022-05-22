import { auth } from "../../Firebase";

export default function LogOut() {
    return (
        <div>
            <button className="button" onClick={() => auth.signOut()}>
                <span className="icon">
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                </span>
            </button>
        </div>
    )
}
