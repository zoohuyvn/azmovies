import clsx from 'clsx'
import styles from './Footer.module.scss'

function Footer() {
    return (
        <div className={clsx(styles.wrapper)}>
            © 2024 AZMovies • All rights reserved.
        </div>
    )
}

export default Footer