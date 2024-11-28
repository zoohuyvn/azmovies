import clsx from 'clsx'
import styles from '../Love/Love.module.scss'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import titles from '~/config/titles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faStar } from '@fortawesome/free-solid-svg-icons'
import routes from '~/config/routes'

function Histories() {
    document.title = titles.histories
    useEffect(() => window.scrollTo(0, 0), [])
    
    const [userAuth] = useState(JSON.parse(localStorage.getItem('auth')))
    const navigate = useNavigate()

	useEffect(() => {
		if (userAuth === null) {
			navigate(routes.home)
		}
	}, [userAuth])

    return (
        <div className={clsx(styles.wrapper)}>
            <p>View histories</p>
            {/* <ul className={clsx(styles.movieList)}>
                <li><Link to=''>
                    <span className={clsx(styles.country)}><img alt='VN' src='https://flagsapi.com/VN/flat/64.png'/></span>
                    <span className={clsx(styles.rating)}><FontAwesomeIcon icon={faStar}/>2.3</span>
                    <span className={clsx(styles.duration)}><FontAwesomeIcon icon={faClock}/>02:16</span>
                    <img alt='' src='https://images.hdqwalls.com/wallpapers/bthumb/peaceful-time-with-bestfriend-sq.jpg'/>
                    <div className={clsx(styles.action)}>
                        <h3>Meta Quest 3 using Unreal End</h3>
                        <span></span>
                    </div>
                </Link></li>
            </ul> */}
        </div>
    )
}

export default Histories