import { useState } from "react";

export default function InputAddItem({ placeholder, addAction, userId, setAction }) {
    const [value, setValue] = useState("");

    return (
        <div>
            <div className="navbar is-fixed-bottom has-shadow is-flex is-flex-direction-column">
                <div className="is-flex is-flex-direction-row is-justify-content-center p-0 mt-2 mb-2">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        addAction(value, userId, setAction);
                        setValue(() => "");
                    }}>
                        <div className="field has-addons">
                            <div className="control">
                                <input className="input" type="text" placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} />
                            </div>
                            <div className="control">
                                <button className="button" onClick={() => {
                                    addAction(value, userId, setAction);
                                    setValue(() => "");
                                }}>
                                    <span className="icon">
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}