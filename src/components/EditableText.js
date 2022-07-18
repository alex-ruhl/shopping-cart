import { useState } from "react"

export default function EditableText({ text, setText }) {
    const [isEditing, setIsEditing] = useState(false);

    const changeHandler = e => {
        setText(e.target.value)
    }

    return (
        <>
            {isEditing ? (
                <div className="field has-addons">
                    <input className="input" type="text" value={text} onChange={changeHandler} />
                    <button className="button is-success" onClick={() => setIsEditing(!isEditing)}>
                        <span className="Icon">
                            <i className="fa fa-check"></i>
                        </span>
                    </button>
                    <button className="button" onClick={() => setIsEditing(!isEditing)}>
                        <span className="Icon">
                            <i className="fa fa-times"></i>
                        </span>
                    </button>
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