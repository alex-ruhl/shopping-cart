import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "../Firebase";
import LoadingAnimation from "./LoadingAnimation";

/**
 * 
 * @param {*} id 
 * @param {*} user 
 * @param {*} pw 
 * @param {*} navigate 
 * @param {*} setRoom 
 */
const checkPermission = async (id, user, pw, navigate, setRoom) => {
    const roomRef = doc(db, "room", id);
    const roomData = await getDoc(roomRef).then(snap => snap.exists() ? snap.data() : null);
    if (roomData === null) {
        navigate("*");
    } else {
        roomData.pw === pw ? setRoom(roomData) : navigate("*");
        if (roomData.users.includes(user.uid)) {
            navigate("/list/" + id)
        }
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} user 
 * @param {*} room 
 * @param {*} navigate 
 */
const addUserToList = async (id, user, room, navigate) => {
    const roomRef = doc(db, "room", id);
    const userRef = doc(db, "user", user.uid);
    await runTransaction(db, async (transaction) => {
        const roomData = await transaction.get(roomRef);
        const userData = await transaction.get(userRef);
        if (!roomData.exists() || !userData.exists) {
            alert("error");
            return;
        }
        // add user in room.users
        let users = roomData.data().users;
        if (!users.includes(user.uid)) {
            users.push(user.uid);
            transaction.update(roomRef, { users: [...users] });
        }
        // add room in user.rooms
        let rooms = userData.data().rooms;
        if (!rooms.filter(room => room.id === id).length > 0) {
            rooms.push({ id: id, name: room.name });
            transaction.update(userRef, { rooms: [...rooms] });
        }
    });
    navigate("/list/" + id)
}

export default function AcceptListInvite({ user }) {
    const [room, setRoom] = useState(null);
    const id = useParams().id;
    const pw = useParams().pw;
    const navigate = useNavigate();

    useEffect(() => {
        checkPermission(id, user, pw, navigate, setRoom);
    }, [id, user, navigate, pw])

    return (
        <div>
            {room ?
                <div className="columns is-centered mt-4">
                    <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                        <div className="box">
                            <h1 className="title is-4">
                                Möchtest du der Einkaufsliste <em>*{room.name}*</em> beitreten?
                            </h1>
                            <div className="is-flex is-flex-direction-row is-justify-content-space-evenly">
                                <Link className="button is-danger" to="/">
                                    <span className="icon">
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </span>
                                </Link>
                                <button className="button is-primary" onClick={() => addUserToList(id, user, room, navigate)}>
                                    <span className="icon">
                                        <i className="fa fa-check" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <LoadingAnimation />
            }
        </div>
    )
}