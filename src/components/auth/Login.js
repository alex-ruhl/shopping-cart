import { signInWithGoogle } from "../../Firebase";

export default function Login() {
    return (
        <div>
            <button className="button" onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    )
}
