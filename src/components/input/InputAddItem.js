import { useState } from "react";
import Picker from 'emoji-picker-react';

export default function InputAddItem({ placeholder, addAction }) {
    const [value, setValue] = useState("");
    const [chooseEmoji, setChooseEmoji] = useState(false);

    const onEmojiClick = (e, emojiObject) => {
        setValue(() => value + emojiObject.emoji);
    };

    return (
        <div>
            <div className="navbar is-fixed-bottom has-shadow is-flex is-flex-direction-column">
                <div className="is-flex is-flex-direction-row is-justify-content-center p-0 mt-2 mb-2">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        addAction(value);
                        setValue(() => "");
                        setChooseEmoji(false);
                    }}>
                        <div className="field has-addons">
                            <p class="control">
                                <button className="button" onClick={() => { setChooseEmoji(!chooseEmoji) }}>
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-smile-o" aria-hidden="true" />
                                    </span>
                                </button>
                            </p>
                            <div className="control">
                                <input className="input" type="text" placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} />
                            </div>
                            <div className="control">
                                <button className="button" onClick={() => {
                                    addAction(value);
                                    setValue(() => "");
                                    setChooseEmoji(false);
                                }}>
                                    <span className="icon">
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="is-flex is-flex-direction-row is-justify-content-center mb-2" style={chooseEmoji ? {} : { display: "none" }}>
                    <div style={chooseEmoji ? {} : { display: "none" }}>
                        <Picker onEmojiClick={onEmojiClick} />
                    </div>
                </div>
            </div>
        </div>
    )
}