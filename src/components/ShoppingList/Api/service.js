import { db } from "../../Firebase";
import { getDoc, doc, runTransaction } from "firebase/firestore";

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