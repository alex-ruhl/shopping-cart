export default function ShareButton({title, text, url}) {
    const shareList = async (title, text, url) => {
        if (navigator.share) {
            navigator.share({ title: title, text: text, url: url });
        } else {
            navigator.clipboard.writeText(url);
        }
    }

    return (
        <div onClick={() => shareList(title, text, url)} className="icon has-text-black is-clickable">
            <i className="fa fa-share-alt" aria-hidden="true"></i>
        </div>
    )
}