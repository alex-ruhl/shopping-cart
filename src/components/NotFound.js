import { Link } from "react-router-dom";

export default function NotFound() {

    return (
        <div>
            <section className="section is-medium">
                <div className="container">
                    <div className="columns is-vcentered">
                        <div clasNames="column has-text-centered">
                            <h1 className="title">404 Page Not Found</h1>
                            <p className="subtitle">An unexpected error has occurred. Please contact the site owner.</p>
                            <Link className="button" to="/">Home</Link>
                        </div>
                        <div className="column has-text-centered">
                            <img src="https://www.eastfieldcollege.edu/PublishingImages/Pages/PageNotFoundError/404-robot.gif" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}