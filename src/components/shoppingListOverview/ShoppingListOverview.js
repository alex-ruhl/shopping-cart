import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import * as api from "./Api/service"
import InputAddItem from "../input/InputAddItem";
import LoadingAnimation from "../LoadingAnimation";
import SettingsModal from "../settingsModal/SettingsModal";

export default function ShoppingList({ user }) {
    const [lists, setLists] = useLocalStorage("einkaufslisten", null);
    const [modalState, setModalState] = useState({ active: false, listId: null, listName: null, listSettings: { ...api.settingsTemplate } });
    const navigate = useNavigate();

    const fetchLists = (uid) => {
        api.getLists(uid).then(lists => setLists(lists));
    }

    useEffect(() => {
        if (user?.uid) {
            fetchLists(user.uid);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div className="mt-4">
            {lists === null ?
                <LoadingAnimation />
                :
                lists.map(list =>
                    <div className={"box mb-1 p-2 is-clickable has-background-" + list.settings.color} onClick={() => navigate("/list/" + list.id)}>
                        <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center">
                            <div className="is-flex is-flex-direction-row">
                                <h2 className="title is-4 has-text-light">{list.name}</h2>
                            </div>
                            <button className={"button is-" + list.settings.color} onClick={(e) => {
                                e.stopPropagation();
                                setModalState({ active: !modalState.active, listId: list.id, listName: list.name, listSettings: list.settings })
                            }}>
                                <i className="fa fa-lg fa-cog has-text-light"></i>
                            </button>
                        </div>
                    </div>
                )
            }
            <SettingsModal
                modalState={modalState}
                setModalState={setModalState}
                deleteList={async () => {
                    await api.deleteList(modalState.listId);
                    localStorage.removeItem(modalState.listId);
                    fetchLists(user.uid);
                }}
                updateList={async (listName, listSettings) => {
                    await api.updateList(modalState.listId, listName, listSettings);
                    fetchLists(user.uid);
                }}
            />
            <div className="mt-4"></div>
            <InputAddItem
                placeholder={"Liste hinzufügen"}
                addAction={
                    async (value, id, setAction) => {
                        await api.addList(value, id);
                        api.getLists(user.uid).then(lists => setAction(lists));
                    }
                }
                id={user.uid}
                setAction={setLists}
            />
        </div>
    )
}