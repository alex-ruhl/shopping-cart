import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../Firebase";
import InputAddItem from "./input/InputAddItem";
import LoadingAnimation from "./LoadingAnimation";

/**
 * 
 * @param {*} uid 
 * @param {*} setLists 
 */
 export const getLists = async (uid, setLists) => {
    const userRef = doc(db, "user", uid);
    getDoc(userRef).then(snap => snap.exists() ? setLists(snap.data().rooms) : "");
}

/**
 * 
 * @param {*} e 
 * @param {*} listId 
 * @param {*} userId 
 * @param {*} setLists 
 */
 export const deleteList = async (e, listId, userId, setLists) => {
    e.stopPropagation();
    const listRef = doc(db, "room", listId);
    let users = await getDoc(listRef).then(snap => snap.data().users);
    deleteDoc(listRef);
    for (let uid of users) {
        const ref = doc(db, "user", uid);
        let userRooms = await getDoc(ref).then(snap => snap.data().rooms);
        userRooms = userRooms.filter(obj => obj.id !== listId);
        setDoc(ref, { rooms: [...userRooms] });
    }
    getLists(userId, setLists);
}

/**
 * 
 * @param {*} list 
 * @param {*} userId 
 * @param {*} setLists 
 * @returns 
 */
 export const addList = async (list, userId, setLists) => {
    if (list === "") return;
    const res = await addDoc(collection(db, "room"), {
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
    const navigate = useNavigate();

    useEffect(() => {
        if(user?.uid) {
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
                            <button className="delete" onClick={(e) => deleteList(e, list.id, user.uid, setLists)}></button>
                        </div>
                    </div>
                )
            }
            <div className="mt-4"></div>
            <InputAddItem placeholder={"Liste hinzufügen"} addAction={addList} userId={user.uid} setAction={setLists} />
        </div>
    )
}