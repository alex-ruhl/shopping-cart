import { doc, getDoc, deleteDoc, setDoc, addDoc, collection, runTransaction } from "firebase/firestore";
import { db } from "../../../Firebase";

/**
 * 
 * @param {*} uid 
 * @returns 
 */
export const getLists = async (uid) => {
    const userRef = doc(db, "user", uid);
    const snap = await getDoc(userRef);
    let rooms = snap.exists() ? snap.data().rooms : null;
    let roomIds = rooms.map(({id}) => id);
    for (const id of roomIds) {
        const list = await getDoc(doc(db, "room", id));
        const settings = list.exists() ? list.data().settings : null;
        rooms.forEach(room=> {
            if (room["id"] === id) {
                room["settings"] = settings;
            }
        });
    }
    return rooms;
}

/**
 * 
 * @param {*} listId 
 */
export const deleteList = async (listId) => {
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
}

/**
 * 
 * @param {*} listId 
 * @param {*} listName 
 * @param {*} listSettings 
 */
export const updateList = async (listId, listName, listSettings) => {
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
}

export const settingsTemplate = {
    color: "primary",
    private: false,
    cache: true
}

/**
 * 
 * @param {*} listName 
 * @param {*} userId 
 * @param {*} settingsTemplate 
 * @returns 
 */
export const addList = async (listName, userId) => {
    if (listName === "") return;
    const res = await addDoc(collection(db, "room"), {
        settings: settingsTemplate,
        items: [],
        name: listName,
        previous: [],
        users: [userId],
        pw: "" + (Math.random() + 1).toString(36).substring(2) + (Math.random() + 1).toString(36).substring(2)
    });
    const userRef = doc(db, "user", userId);
    let rooms = await getDoc(userRef).then(snap => snap.data().rooms);
    rooms.push({ id: res.id, name: listName })
    await setDoc(userRef, { rooms: [...rooms] });
}