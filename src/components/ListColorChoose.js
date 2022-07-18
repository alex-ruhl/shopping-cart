import ColorBox from "./ColorBox"

const colors = [
    "black",
    "primary",
    "link",
    "info",
    "success",
    "warning",
    "danger"
]

export default function ListColorChoose({onClick}) {
    return (
        colors.map(color => 
            <ColorBox color={color} onClick={() => {onClick(color)}} />
        )
    )
}