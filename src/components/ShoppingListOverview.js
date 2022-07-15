import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../Firebase";
import InputAddItem from "./input/InputAddItem";
import LoadingAnimation from "./LoadingAnimation";
import SettingsModal from "./SettingsModal";

const settingsTemplate = {
    cacheItems: "",
    color: "",
    private: "",
    cache: ""
}

export const getLists = async (uid, setLists) => {
    const userRef = doc(db, "user", uid);
    getDoc(userRef).then(snap => snap.exists() ? setLists(snap.data().rooms) : "");
}


export const deleteList = async (e, listId, userId, setLists) => {
    e.stopPropagation();
    const listRef = doc(db, "room", listId);
    let users = await getDoc(listRef).then(snap => snap.data().users);
    deleteDoc(listRef);
    // Remove deleted from all Users
    for (let uid of users) {
        const ref = doc(db, "user", uid);
        let userRooms = await getDoc(ref).then(snap => snap.data().rooms);
        userRooms = userRooms.filter(obj => obj.id !== listId);
        setDoc(ref, { rooms: [...userRooms] });
    }
    getLists(userId, setLists);
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
    const [isModal, setIsModal] = useState(false);
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
                    <div className="box mb-1 p-2 has-background-primary is-clickable" onClick={() => navigate("/list/" + list.id)}>
                        <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center">
                            <div className="is-flex is-flex-direction-row">
                                <h2 className="title is-4 has-text-light">{list.name}</h2>
                            </div>
                            <span class="icon" onClick={(e) => {
                                e.stopPropagation();
                                setIsModal(!isModal);
                            }} /* onClick={(e) => deleteList(e, list.id, user.uid, setLists)} */>
                                <i className="fa fa-lg fa-cog has-background-primary has-text-light"></i>
                            </span>
                        </div>
                    </div>
                )
            }
            <SettingsModal isModal={isModal} setIsModal={setIsModal} settings={null}/>
            <div className="mt-4"></div>
            <InputAddItem placeholder={"Liste hinzufügen"} addAction={addList} id={user.uid} setAction={setLists} />
        </div>
    )
}