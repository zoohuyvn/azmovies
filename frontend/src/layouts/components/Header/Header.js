import clsx from 'clsx'
import styles from './Header.module.scss'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import routes from '~/config/routes'
import logo from '~/assets/images/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faGear, faHeart, faHistory, faSearch, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'

function Header() {
    const [userAuth, setUserAuth] = useState(JSON.parse(localStorage.getItem('auth')))
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const handleLogout = () => {
        localStorage.removeItem('auth')
        navigate(routes.home)
    }

    const handleSearch = e => {
        if (e.key === 'Enter') {
            const keyword = e.target.value
            setSearchParams({ keyword })
        }
    }

    return (
        <div className={clsx(styles.wrapper)}>
            <Link className={clsx(styles.logo)} to={routes.home}><img alt='AZMovies logo' src={logo}/></Link>
            <div className={clsx(styles.searchBox)}>
                <FontAwesomeIcon icon={faSearch} className={clsx(styles.searchBoxIcon)}/>
                <input type='text' placeholder='Search for movies, TV shows...' onKeyDown={handleSearch}/>
            </div>
            <div className={clsx(styles.user)} key={userAuth}>
                {
                    userAuth === null ?
                    <Link to={routes.login}>Login</Link> :
                    <img alt={userAuth.first_name} src={`https://ui-avatars.com/api/?background=${userAuth.role === 1 ? '000000' : '6694F0'}&color=fff&name=${userAuth.first_name}+${userAuth.last_name}`}/>
                }
                <ul>
                    <li><Link to={routes.profile}><FontAwesomeIcon icon={faUser}/>Profile</Link></li>
                    <li><Link to={routes.love}><FontAwesomeIcon icon={faHeart}/>Love movie</Link></li>
                    <li><Link to={routes.saved}><FontAwesomeIcon icon={faBookmark}/>Saved movie</Link></li>
                    {/* <li><Link to={routes.histories}><FontAwesomeIcon icon={faHistory}/>Histories</Link></li> */}
                    {userAuth !== null && userAuth.role === 1 ? <li><Link to={routes.dashboard}><FontAwesomeIcon icon={faGear}/>Admin</Link></li> : ''}
                    <span></span>
                    <li onClick={() => {handleLogout(); setUserAuth(null)}}><Link><FontAwesomeIcon icon={faSignOut}/>Log out</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Header