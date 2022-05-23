import { signInWithGoogle } from "../../Firebase";

export default function Login() {
    return (
        <div>
            <div className="columns section">
                <div className="column is-flex is-justify-content-center is-align-items-center" style={{ height: "100vh" }}>
                    <div className="box has-background-primary">
                        <h3 className="title block has-text-white">
                            Melde dich an!
                        </h3>
                        <p className="block has-text-white">
                            Benutze Shoppin Cart um Einkaufslisten zu erstellen und mit deinen liebsten zu teilen.
                        </p>
                        <div className="is-flex is-flex-direction-row is-justify-content-center">
                            <button className="button" onClick={signInWithGoogle}>Sign in with Google</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
