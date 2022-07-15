import { useState } from "react"

export default function EditableText({ text }) {
    const [isEditing, setIsEditing] = useState(false);
    const [input, setInput] = useState(text);

    const changeHandler = e => {
        setInput(e.target.value)
    }

    return (
        <>
            {isEditing ? (
                <div className="field has-addons">
                    <div class="control">
                        <input className="input title is-4" type="text" value={input} onChange={changeHandler} />
                    </div>
                    <div className="control">
                        <button className="button is-large is-success" onClick={() => setIsEditing(!isEditing)}>
                            <span className="Icon">
                                <i className="fa fa-floppy-o" ></i>
                            </span>
                        </button>
                    </div>
                    <div className="control">
                        <button className="button is-large" onClick={() => setIsEditing(!isEditing)}>
                            <span className="Icon">
                                <i className="fa fa-times"></i>
                            </span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="is-flex is-flex-direction-row is-justify-content-space-between">
                    <h2 className="title is-4 mb-0 mt-">{text}</h2>
                    <button className="button" onClick={() => setIsEditing(!isEditing)}>
                        <span className="Icon">
                            <i className="fa fa-lg fa-pencil-square-o"></i>
                        </span>
                    </button>
                </div>
            )}

        </>
    )
}