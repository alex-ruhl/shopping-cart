import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firebase";
import { getDoc, doc, runTransaction } from "firebase/firestore";
import InputAddItem from "./input/InputAddItem";
import LoadingAnimation from "./LoadingAnimation";

/**
 * 
 * @param {*} id 
 * @param {*} user 
 * @param {*} setRoom 
 * @param {*} navigate 
 */
export const checkListPermission = async (id, user, setRoom, navigate) => {
    const roomRef = doc(db, "room", id);
    const roomData = await getDoc(roomRef).then(snap => snap.exists() ? snap.data() : null);
    if (roomData === null) {
        navigate("*");
    } else {
        roomData.users.includes(user.uid) ? setRoom(roomData) : navigate("*");
    }
}

/**
 * 
 * @param {*} e 
 * @param {*} item 
 * @param {*} id 
 * @param {*} setRoom 
 */
const removeItemFromActiveList = async (e, item, id, setRoom) => {
    e.stopPropagation();
    const roomRef = doc(db, "room", id);
    await runTransaction(db, async (transaction) => {
        const roomData = await transaction.get(roomRef);
        let newItems = roomData.data().items;
        let prevItems = roomData.data().previous;
        newItems = newItems.filter(obj => obj !== item);
        prevItems.push(item);
        transaction.update(roomRef, { items: [...newItems], previous: [...prevItems] });
    });
    getDoc(roomRef).then(snap => snap.exists() ? setRoom(snap.data()) : null);
}

/**
 * 
 * @param {*} e 
 * @param {*} item 
 * @param {*} id 
 * @param {*} setRoom 
 */
const removeItemFromPreviousList = async (e, item, id, setRoom) => {
    e.stopPropagation();
    const roomRef = doc(db, "room", id);
    await runTransaction(db, async (transaction) => {
        const roomData = await transaction.get(roomRef);
        let prevItems = roomData.data().previous;
        prevItems = prevItems.filter(obj => obj !== item);
        transaction.update(roomRef, { previous: [...prevItems] });
    });
    getDoc(roomRef).then(snap => snap.exists() ? setRoom(snap.data()) : null);
}

/**
 * 
 * @param {*} item 
 * @param {*} id 
 * @param {*} setRoom 
 */
const moveItemToActiveList = async (item, id, setRoom) => {
    const roomRef = doc(db, "room", id);
    await runTransaction(db, async (transaction) => {
        const roomData = await transaction.get(roomRef);
        let prevItems = roomData.data().previous;
        let newItems = roomData.data().items;
        prevItems = prevItems.filter(obj => obj !== item);
        newItems.push(item);
        transaction.update(roomRef, { items: [...newItems], previous: [...prevItems] });
    });
    getDoc(roomRef).then(snap => snap.exists() ? setRoom(snap.data()) : null);
}

/**
 * 
 * @param {*} item 
 * @param {*} id 
 * @param {*} setRoom 
 */
const addItemToList = async (item, id, setRoom) => {
    if (item !== "") {
        const roomRef = doc(db, "room", id);
        await runTransaction(db, async (transaction) => {
            const roomData = await transaction.get(roomRef);
            let newItems = roomData.data().items;
            newItems.push(item);
            transaction.update(roomRef, { items: [...newItems] });
        });
        getDoc(roomRef).then(snap => setRoom(snap.data()));
    }
}

export default function ShoppingList({ user }) {
    const [room, setRoom] = useState(null);
    const id = useParams().id;
    const navigate = useNavigate();

    useEffect(() => {
        checkListPermission(id, user, setRoom, navigate);
    }, [id, user, navigate])

    return (
        <div>
            {room ?
                <>
                    <div className="is-flex is-flex-row is-justify-content-space-between">
                        <div className="is-flex is-flex-row mb-4">
                            <span className="icon is-clickable mr-2 mt-2" onClick={() => navigate("/")}>
                                <i className="fa fa-arrow-left" aria-hidden="true"></i>
                            </span>
                            <h1 className="title">
                                {room.name}
                            </h1>
                        </div>
                        <a href={"whatsapp://send?text=" + encodeURIComponent("Ich lade dich zu meiner Einkaufsliste \"" + room.name + "\" ein: " + window.location.href + "/" + room.pw)} className="icon has-text-black is-clickable mr-2 mt-2">
                            <i className="fa fa-share-alt" aria-hidden="true"></i>
                        </a>
                    </div>
                    <div className="">
                        <div className="columns">
                            {room.items.map(item => {
                                return (
                                    <div className="column p-0 m-1" onClick={() => { }}>
                                        <div className="box p-2 is-flex is-flex-row is-justify-content-space-between is-align-items-center has-background-primary">
                                            <p className="subtitle has-text-light m-0">{item}</p>
                                            <button className="delete is-pulled-right" onClick={(e) => removeItemFromActiveList(e, item, id, setRoom)}></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="columns mt-4">
                            {room.previous.map(item => {
                                return (
                                    <div className="column p-0 m-1" onClick={() => moveItemToActiveList(item, id, setRoom)}>
                                        <div className="box p-2 is-flex is-flex-row is-justify-content-space-between is-align-items-center has-background-danger">
                                            <p className="subtitle has-text-light m-0">{item}</p>
                                            <button className="delete is-pulled-right" onClick={(e) => removeItemFromPreviousList(e, item, id, setRoom)}></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <InputAddItem placeholder={"Was willst du kaufen?"} addAction={addItemToList} id={id} setAction={setRoom} />
                </> : <LoadingAnimation />}
        </div>
    )
}
