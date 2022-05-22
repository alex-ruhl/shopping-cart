export default function LoadingAnimation() {
    return (
        <div className="is-flex is-justify-content-center">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <span className="sr-only">Loading...</span>
        </div>
    )
}