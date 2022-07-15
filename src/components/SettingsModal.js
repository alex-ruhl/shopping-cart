import { useState } from "react";
import ColorBox from "./ColorBox";
import EditableText from "./EditableText";
import ListColorChoose from "./ListColorChoose";

export default function SettingsModal({ isModal, setIsModal }) {
    const [chooseColor, setChooseColor] = useState(false);

    const toggleSettingsModal = (e) => {
        e.stopPropagation();
        setIsModal(!isModal)
    }

    const active = isModal ? "is-active" : "";

    return (
        <div>
            <div className={`modal ${active}`}>
                <div className="modal-background" />
                <div className="modal-card section">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Einstellungen</p>
                        <button className="delete" aria-label="close" onClick={(e) => toggleSettingsModal(e)} />
                    </header>
                    <section className="modal-card-body">
                        <EditableText text={"test"} />
                        <hr className="mb-2 mt-2" />
                        <div class="field">
                            <div class="control">
                                <label class="checkbox">
                                    <input type="checkbox" className="mr-1" checked={"checked"} /> Artikel nach dem Kauf speichern
                                </label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <label class="checkbox">
                                    <input type="checkbox" className="mr-1" checked={""} /> Die Liste ist privat
                                </label>
                            </div>
                        </div>
                        <hr className="mb-2 mt-0" />
                        <div className="is-flex is-flex-direction-row is-justify-content-space-between is-allign-items-center mb-2">
                            <div className="is-flex is-flex-direction-row is-align-items-center">
                                <ColorBox color={"primary"} />
                                <p className="ml-1">Aktuelle Farbe</p>
                            </div>
                            <button className="button" onClick={() => setChooseColor(!chooseColor)}>
                                <span className="Icon">
                                    {
                                        chooseColor ?
                                            <i className="fa fa-lg fa-angle-double-up"></i>
                                            :
                                            <i className="fa fa-lg fa-angle-double-down" />
                                    }

                                </span>
                            </button>
                        </div>
                        {
                            chooseColor ?
                                <>
                                    <p className="mb-1">Verfügbare Farben:</p>
                                    <ListColorChoose />
                                </>
                                :
                                ""
                        }
                        <hr className="mb-2 mt-0" />
                        <button class="button is-danger pull-right">
                            <i class="fa fa-trash-o mr-2"></i> Liste Löschen
                        </button>
                    </section>
                    <footer className="modal-card-foot">
                        <div className="pull-right">
                        <button className="button is-success">Speichern</button>
                        <button className="button" onClick={(e) => toggleSettingsModal(e)}>Abbrechen</button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}