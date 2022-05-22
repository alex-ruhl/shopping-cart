import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "../Firebase";
import LoadingAnimation from "./LoadingAnimation";

export default function AcceptListInvite({ user }) {
    const [room, setRoom] = useState(null);
    const id = useParams().id;
    const pw = useParams().pw;
    const navigate = useNavigate();

    useEffect(() => {
        async function checkPermission() {
            const roomRef = doc(db, "room", id);
            const roomData = await getDoc(roomRef).then(snap => snap.exists() ? snap.data() : null);
            if (roomData === null) {
                navigate("*");
                return;
            }
            roomData.pw === pw ? setRoom(roomData) : navigate("*");
        }
        checkPermission();
    }, [id, user.uid, navigate, pw])

    const addUserToList = async (id, user) => {
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

    if (room === null) {
        return (
            <LoadingAnimation />
        )
    }
    return (
        <div>
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
                            <button className="button is-primary" onClick={() => addUserToList(id, user)}>
                                <span className="icon">
                                    <i className="fa fa-check" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}