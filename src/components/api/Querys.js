import { db } from "../../Firebase";
import { doc, getDoc, addDoc, collection, setDoc, deleteDoc } from "firebase/firestore";

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