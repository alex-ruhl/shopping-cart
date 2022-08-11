import { useEffect, useState } from "react";
import ColorBox from "./ColorBox";
import ConfirmModal from "./../ConfirmModal";
import EditableText from "./../EditableText";
import ListColorChoose from "./ListColorChoose";

export default function SettingsModal({ modalState, setModalState, deleteList, updateList }) {
    const [chooseColor, setChooseColor] = useState(false);
    const [settingsCache, setSettingsCache] = useState({ ...modalState.listSettings });
    const [listNameCache, setListNameCache] = useState(modalState.listName);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        setSettingsCache({ ...modalState.listSettings });
        setListNameCache(modalState.listName);
    }, [modalState])

    const active = modalState.active ? "is-active" : "";
    const checked = (state) => state ? "checked" : "";

    const toggleSettingsCheckBox = (obj, key) => {
        setSettingsCache(prev => ({ ...prev, [key]: !obj[key] }))
    }
    const setSettingsColor = (color) => {
        setSettingsCache(prev => ({ ...prev, color: color }))
    }
    const toggleSettingsModal = (e) => {
        if (e) e.stopPropagation();
        setModalState(prev => ({ ...prev, active: !modalState.active }))
    }

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
                        <EditableText text={listNameCache} setText={setListNameCache} />
                        <hr className="mb-2 mt-2" />
                        <div className="field" >
                            <div className="control">
                                <label className="checkbox" >
                                    <input type="checkbox" className="mr-1" checked={checked(settingsCache.cache)} onChange={() => toggleSettingsCheckBox(settingsCache, "cache")} /> Artikel nach dem Kauf speichern
                                </label>
                            </div>
                        </div>
                        <div className="field" >
                            <div className="control">
                                <label className="checkbox" >
                                    <input type="checkbox" className="mr-1" checked={checked(settingsCache.private)} onChange={() => toggleSettingsCheckBox(settingsCache, "private")} /> Die Liste ist privat
                                </label>
                            </div>
                        </div>
                        <hr className="mb-2 mt-0" />
                        <div className="is-flex is-flex-direction-row is-justify-content-space-between is-allign-items-center mb-2">
                            <div className="is-flex is-flex-direction-row is-align-items-center">
                                <ColorBox color={settingsCache.color} />
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
                                    <ListColorChoose onClick={setSettingsColor} />
                                </>
                                :
                                ""
                        }
                        <hr className="mb-2 mt-0" />
                        <button className="button is-danger pull-right" onClick={() => {
                            setConfirmDelete(true);
                        }}>
                            <i className="fa fa-trash-o mr-2"></i> Liste Löschen
                        </button>
                    </section>
                    <footer className="modal-card-foot">
                        <div className="pull-right">
                            <button className="button is-success" onClick={() => {
                                updateList(listNameCache, settingsCache);
                                toggleSettingsModal();
                            }}>Speichern</button>
                            <button className="button" onClick={(e) => toggleSettingsModal(e)}>Abbrechen</button>
                        </div>
                    </footer>
                </div>
            </div>
            <ConfirmModal isModal={confirmDelete} setIsModal={setConfirmDelete} confirmAction={
                () => {
                    deleteList();
                    toggleSettingsModal();
                }
            } body={<h1 className="title is-4">Möchtest du die Liste "{listNameCache}" wirklich löschen?</h1>} />
        </div>
    )
}