import { useState, forwardRef} from "react";

const InputAddItem = (props, ref) => {
    const [value, setValue] = useState("");

    return (
        <div>
            <div className="navbar is-fixed-bottom has-shadow is-flex is-flex-direction-column" ref={ref}>
                <div className="is-flex is-flex-direction-row is-justify-content-center p-0 mt-2 mb-2">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        props.addAction(value, props.id, props.setAction);
                        setValue(() => "");
                    }}>
                        <div className="field has-addons">
                            <div className="control">
                                <input className="input" type="text" placeholder={props.placeholder} value={value} onChange={e => setValue(e.target.value)} />
                            </div>
                            <div className="control">
                                <button className="button" onClick={() => {
                                    props.addAction(value, props.id, props.setAction);
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

export default forwardRef(InputAddItem);