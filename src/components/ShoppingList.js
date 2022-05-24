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
 * @param {*} item 
 * @param {*} id 
 * @param {*} setRoom 
 */
const removeItemFromList = async (e, item, id, setRoom) => {
    e.stopPropagation();
    const roomRef = doc(db, "room", id);
    await runTransaction(db, async (transaction) => {
        const roomData = await transaction.get(roomRef);
        let newItems = roomData.data().items;
        newItems = newItems.filter(obj => obj !== item);
        transaction.update(roomRef, { items: [...newItems] });
    });
    getDoc(roomRef).then(snap => snap.exists() ? setRoom(snap.data()) : null);
}

export default function ShoppingList({ user }) {
    const [room, setRoom] = useState(null);
    const id = useParams().id;
    const navigate = useNavigate();

    useEffect(() => {
        checkListPermission(id, user, setRoom, navigate);
    }, [id, user, navigate])

    const addItemToList = async (item) => {
        if (item === "") return;
        const roomRef = doc(db, "room", id);
        await runTransaction(db, async (transaction) => {
            const roomData = await transaction.get(roomRef);
            let newItems = roomData.data().items;
            newItems.push(item);
            transaction.update(roomRef, { items: [...newItems] });
        });
        getDoc(roomRef).then(snap => setRoom(snap.data()));
    }

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
                    <div className="columns">
                        {room.items.map(item => {
                            return (
                                <div className="column p-0 m-1" onClick={() => { }}>
                                    <div className="box p-2 is-flex is-flex-row is-justify-content-space-between is-align-items-center has-background-primary ">
                                        <p className="subtitle has-text-light m-0">{item}</p>
                                        <button className="delete is-pulled-right" onClick={(e) => removeItemFromList(e, item, id, setRoom)}></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <InputAddItem placeholder={"Was willst du kaufen?"} addAction={addItemToList} />
                </> : <LoadingAnimation />}
        </div>
    )
}
