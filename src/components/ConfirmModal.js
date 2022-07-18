export default function ConfirmModal({ isModal, setIsModal, confirmAction, body }) {
    const active = isModal ? "is-active" : "";
    return (
        <div className={`modal ${active}`}>
            <div className="modal-background" />
            <div className="modal-card section">
                <section className="modal-card-body">
                    {body}
                </section>
                <footer className="modal-card-foot">
                    <div className="pull-right">
                        <button className="button is-success" onClick={() => {
                            confirmAction();
                            setIsModal(false);
                        }}>Bestätigen</button>
                        <button className="button" onClick={() => setIsModal(false)}>Abbrechen</button>
                    </div>
                </footer>
            </div>
        </div>
    )
}