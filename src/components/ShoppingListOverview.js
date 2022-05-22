import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLists, deleteList, addList } from "./api/Querys";
import InputAddItem from "./input/InputAddItem";
import LoadingAnimation from "./LoadingAnimation";

export default function ShoppingList({ user }) {
    const [lists, setLists] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getLists(user.uid, setLists);
    }, [user.uid])

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