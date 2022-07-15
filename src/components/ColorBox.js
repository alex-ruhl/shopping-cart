import styles from './ColorBox.module.css';

export default function ColorBox({color}) {
    return (
        <div className={styles.colorBox + " has-background-" + color}></div>
    )
}