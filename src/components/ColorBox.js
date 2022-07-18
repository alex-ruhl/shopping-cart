import styles from './ColorBox.module.css';

export default function ColorBox({color, onClick}) {
    return (
        <div className={styles.colorBox + " has-background-" + color} onClick={onClick}></div>
    )
}