import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc, setDoc, addDoc, collection, runTransaction } from "firebase/firestore";
import { db } from "../Firebase";
import InputAddItem from "./input/InputAddItem";
import LoadingAnimation from "./LoadingAnimation";
import SettingsModal from "./SettingsModal";

const settingsTemplate = {
    color: "primary",
    private: false,
    cache: true
}

export const getLists = async (uid, setLists) => {
    const userRef = doc(db, "user", uid);
    const snap = await getDoc(userRef);
    let rooms;
    snap.exists() ? rooms = snap.data().rooms : rooms = null;
    let roomIds = rooms.map(({id}) => id);
    for (const id of roomIds) {
        const list = await getDoc(doc(db, "room", id));
        let settings;
        list.exists() ? settings = list.data().settings : settings = null;
        rooms.forEach(room=> {
            if (room["id"] === id) {
                room["settings"] = settings;
            }
        });
    }
    setLists(rooms);
}


export const deleteList = async (listId, userId, setLists) => {
    const listRef = doc(db, "room", listId);
    let users = await getDoc(listRef).then(snap => snap.data().users);
    deleteDoc(listRef);
    // Remove deleted list from all Users
    for (let uid of users) {
        const ref = doc(db, "user", uid);
        let userRooms = await getDoc(ref).then(snap => snap.data().rooms);
        userRooms = userRooms.filter(obj => obj.id !== listId);
        setDoc(ref, { rooms: [...userRooms] });
    }
    getLists(userId, setLists);
}

export const updateList = async (listId, listName, listSettings, userId, setLists) => {
    const listRef = doc(db, "room", listId);
    await runTransaction(db, async (transaction) => {
        let users = await getDoc(listRef).then(snap => snap.data().users);
        for (let uid of users) {
            const ref = doc(db, "user", uid);
            let userRooms = await getDoc(ref).then(snap => snap.data().rooms);
            userRooms.forEach(room => {
                if(room["id"] === listId) {
                    room["name"] = listName;
                }
            })
            setDoc(ref, { rooms: [...userRooms] });
        }
        transaction.update(listRef, { name: listName, settings: {...listSettings} });
    });
    await getLists(userId, setLists);
}

export const addList = async (list, userId, setLists) => {
    if (list === "") return;
    const res = await addDoc(collection(db, "room"), {
        settings: settingsTemplate,
        items: [],
        name: list,
        previous: [],
        users: [userId],
        pw: "" + (Math.random() + 1).toString(36).substring(2) + (Math.random() + 1).toString(36).substring(2)
    });
    const userRef = doc(db, "user", userId);
    let rooms = await getDoc(userRef).then(snap => snap.data().rooms);
    rooms.push({ id: res.id, name: list })
    setDoc(userRef, { rooms: [...rooms] });
    setLists(rooms);
}

export default function ShoppingList({ user }) {
    const [lists, setLists] = useState(null);
    const [modalState, setModalState] = useState({active: false, listId: null, listName: null, listSettings: {...settingsTemplate}});
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.uid) {
            getLists(user.uid, setLists);
        }
    }, [user])

    return (
        <div className="mt-4">
            <h1 className="title">Meine Listen</h1>
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
                                setModalState({active: !modalState.active, listId: list.id, listName: list.name, listSettings: list.settings})
                            }}>
                                <i className="fa fa-lg fa-cog has-text-light"></i>
                            </button>
                        </div>
                    </div>
                )
            }
            <SettingsModal modalState={modalState} setModalState={setModalState} deleteList={() => deleteList(modalState.listId, user.uid, setLists)} updateList={async (listName, listSettings) => await updateList(modalState.listId, listName, listSettings, user.uid, setLists)}/>
            <div className="mt-4"></div>
            <InputAddItem placeholder={"Liste hinzufügen"} addAction={addList} id={user.uid} setAction={setLists} />
        </div>
    )
}