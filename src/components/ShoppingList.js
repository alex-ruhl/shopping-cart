import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firebase";
import { getDoc, doc, runTransaction } from "firebase/firestore";
import InputAddItem from "./input/InputAddItem";
import LoadingAnimation from "./LoadingAnimation";

export default function ShoppingList({ user }) {
    const [room, setRoom] = useState(null);
    const id = useParams().id;
    const navigate = useNavigate();

    useEffect(() => {
        async function checkPermission() {
            const roomRef = doc(db, "room", id);
            const roomData = await getDoc(roomRef).then(snap => snap.exists() ? snap.data() : null);
            if (roomData === null) {
                navigate("*");
                return;
            }
            roomData.users.includes(user.uid) ? setRoom(roomData) : navigate("*");
        }
        checkPermission();
    }, [id, user.uid, navigate])

    const addItem = async (item) => {
        if (item === "") return;
        const roomRef = doc(db, "room", id);
        await runTransaction(db, async (transaction) => {
            const roomData = await transaction.get(roomRef);
            if (!roomData.exists()) {
                alert("error");
            }
            let newItems = roomData.data().items;
            newItems.push(item);
            transaction.update(roomRef, { items: [...newItems] });
        });
        getDoc(roomRef).then(snap => setRoom(snap.data()));
    }

    const removeItem = async (item) => {
        const roomRef = doc(db, "room", id);
        await runTransaction(db, async (transaction) => {
            const roomData = await transaction.get(roomRef);
            if (!roomData.exists()) {
                alert("error");
            }
            let newItems = roomData.data().items;
            newItems = newItems.filter(obj => obj !== item);
            transaction.update(roomRef, { items: [...newItems] });
        });
        getDoc(roomRef).then(snap => setRoom(snap.data()));
    }

    return (
        <div>
            <div className="is-flex is-flex-row is-justify-content-space-between">
                <div className="is-flex is-flex-row mb-4">
                    <span className="icon is-clickable mr-2 mt-2" onClick={() => navigate(-1)}>
                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    </span>
                    <h1 className="title">
                        {room ? room.name : <LoadingAnimation />}
                    </h1>
                </div>
                {room ?
                    <a href={"whatsapp://send?text=" + encodeURIComponent("Ich lade dich zu meiner Einkaufsliste ein: " + window.location.href + "/" + room.pw)} className="icon is-clickable mr-2 mt-2">
                        <i className="fa fa-share-alt" aria-hidden="true"></i>
                    </a>
                    : ""}
            </div>
            <div className="columns">
                {room ? room.items.map(item => {
                    return (
                        <div className="column p-0 m-1">
                            <div className="box p-2 is-flex is-flex-row is-justify-content-space-between is-align-items-center has-background-primary ">
                                <p className="subtitle has-text-light m-0">{item}</p>
                                <button className="delete is-pulled-right" onClick={() => removeItem(item)}></button>
                            </div>
                        </div>
                    )
                }) : <LoadingAnimation />}
            </div>
            <InputAddItem placeholder={"Was willst du kaufen?"} addAction={addItem} />
        </div>
    )
}