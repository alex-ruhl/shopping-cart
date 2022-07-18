import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firebase";
import { getDoc, doc, runTransaction } from "firebase/firestore";
import styles from './ShoppingList.module.css';
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
const removeItemFromActiveList = async (item, id, setRoom, index, room) => {
    room.items[index] = { value: room.items[index], checked: true }
    setRoom(prev => ({ ...prev, items: room.items }));

    await new Promise(resolve => setTimeout(resolve, 150));

    const prevItem = room.items.splice(index, 1)[0];
    room.previous.splice(0, 0, prevItem.value);
    setRoom(prev => ({ ...prev, items: room.items, previous: room.previous }));

    const roomRef = doc(db, "room", id);
    await runTransaction(db, async (transaction) => {
        const roomData = await transaction.get(roomRef);
        let newItems = roomData.data().items;
        let prevItems = roomData.data().previous;
        newItems = newItems.filter(obj => obj !== item);
        prevItems.splice(0, 0, item);
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
const removeItemFromPreviousList = async (e, item, id, setRoom, index, room) => {
    e.stopPropagation();
    room.previous.splice(index, 1);
    setRoom(prev => ({ ...prev, previous: room.previous }));

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
const moveItemToActiveList = async (item, id, setRoom, index, room) => {
    const newItem = room.previous.splice(index, 1)[0];
    room.items.push(newItem);
    setRoom(prev => ({ ...prev, items: room.items, previous: room.previous }));

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

const shareList = async (title, text, url) => {
    if (navigator.share) {
        navigator.share({ title: title, text: text, url: url });
    } else {
        navigator.clipboard.writeText(url);
    }
}

export default function ShoppingList({ user }) {
    const itemsRef = useRef();
    const prevRef = useRef();
    const addRef = useRef();
    const [addHeight, setAddHeight] = useState(null);
    const [room, setRoom] = useState(null);
    const [addRefContained, setAddRefContained] = useState(false);
    const [viewHeights, setViewHeights] = useState({ current: "50vh", previous: "10vh", previousSelected: false })
    const id = useParams().id;
    const navigate = useNavigate();

    const handleResize = () => {
        if (addRef?.current) {
            setAddRefContained(true);
            setAddHeight(addRef.current.getBoundingClientRect());
        }
    }

    const updateViewHeights = (current, previous, previousSelected = null) => {
        setViewHeights({
            current: current,
            previous: previous,
            previousSelected: previousSelected === null ? viewHeights.previousSelected : previousSelected
        })
    }

    useEffect(() => {
        if (!addRefContained) {
            handleResize()
        }
    })

    useEffect(() => {
        checkListPermission(id, user, setRoom, navigate);
    }, [id, user, navigate])

    useEffect(() => {
        window.addEventListener("resize", handleResize, false);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])

    useEffect(() => {
        if (itemsRef?.current && prevRef?.current && addHeight !== null) {
            const posItems = itemsRef.current.getBoundingClientRect();
            const listHeight = parseInt(addHeight.top) - parseInt(posItems.top) - parseInt(addHeight.height);
            const prevHeight = Math.floor(listHeight / 5);
            const itemsHeight = prevHeight * 4;
            updateViewHeights(
                itemsHeight,
                prevHeight
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addHeight])

    return (
        <div>
            {room ?
                <>
                    <div className="is-flex is-flex-row is-justify-content-space-between mb-2">
                        <div className="is-flex is-flex-row is-align-items-center">
                            <span className="icon is-clickable mr-2" onClick={() => navigate("/")}>
                                <i className="fa fa-arrow-left" aria-hidden="true"></i>
                            </span>
                            <h1 className="title is-4">
                                {room.name}
                            </h1>
                        </div>
                        <div className="is-flex is-align-items-center">
                            <div onClick={() => shareList("Shopping Cart", "Ich lade dich zu meiner Einkaufsliste \"" + room.name + "\" ein!", window.location.href + "/" + room.pw)} className="icon has-text-black is-clickable">
                                <i className="fa fa-share-alt" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                        <div>
                            <div className={styles.animation + " tile is-child"} style={{ height: viewHeights.current }} ref={itemsRef}>
                                <div className={styles.currentList}>
                                    <div className="columns is-multiline">
                                        {room.items.map((item, index) => {
                                            return (
                                                <div className="column is-6 p-1" onClick={() => removeItemFromActiveList(item, id, setRoom, index, room)}>
                                                    <div className="box p-1 is-flex is-flex-row is-align-items-center has-background-primary is-clickable">
                                                        <span className="icon ml-1">
                                                            {item?.checked === true ? (
                                                                <i className="fa fa-lg fa-check-square-o has-text-light mr-3" />
                                                            ) : (
                                                                <i className="fa fa-lg fa-square-o has-text-light mr-3" />
                                                            )}
                                                        </span>
                                                        <p className="subtitle has-text-light m-0">{item?.value || item}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            { room.previous.length > 0 ? (
                            <div className={styles.animation + " tile is-child"} style={{ height: viewHeights.previous }} ref={prevRef}>
                                <div className="p-2 mt-1 mb-1 is-flex is-flex-row is-justify-content-flex-end is-align-items-center is-clickable" onClick={() => updateViewHeights(viewHeights.previous, viewHeights.current, !viewHeights.previousSelected)}>
                                    <span className="icon">
                                        {viewHeights.previousSelected ? (
                                            <i className="fa fa-lg fa-angle-double-down" />
                                        ) : (
                                            <i className="fa fa-lg fa-angle-double-up" />
                                        )}
                                    </span>
                                </div>
                                <hr className="mb-1 mt-1" />
                                <div className={styles.previousList}>
                                    <div className="columns is-multiline">
                                        {room.previous.map((item, index) => {
                                            return (
                                                <div className="column is-6 p-1" onClick={() => moveItemToActiveList(item, id, setRoom, index, room)}>
                                                    <div className="box p-1 is-flex is-flex-row is-justify-content-space-between is-align-items-center has-background-danger animation">
                                                        <p className="subtitle has-text-light m-0 ml-1">{item}</p>
                                                        <button className="delete is-pulled-right" onClick={(e) => removeItemFromPreviousList(e, item, id, setRoom, index, room)}></button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            ) : ("")}
                        </div>
                    <InputAddItem placeholder={"Was willst du kaufen?"} addAction={addItemToList} id={id} setAction={setRoom} ref={addRef}/>
                </> : <LoadingAnimation />}
        </div>
    )
}
