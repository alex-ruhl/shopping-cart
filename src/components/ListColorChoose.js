import ColorBox from "./ColorBox"

const colors = [
    "black",
    "grey",
    "light",
    "dark",
    "primary",
    "link",
    "info",
    "success",
    "warning",
    "danger",
    "primary-light",
    "link-light",
    "info-light",
    "info-light",
    "warning-light",
    "danger-light",
    "primary-dark",
    "link-dark",
    "info-dark",
    "success-dark",
    "warning-dark",
    "danger-dark"
]

export default function ListColorChoose() {
    return (
        colors.map(color => 
            <ColorBox color={color}/>
        )
    )
}