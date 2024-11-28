import clsx from 'clsx'
import styles from '../Love/Love.module.scss'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import titles from '~/config/titles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faClock, faStar } from '@fortawesome/free-solid-svg-icons'
import routes from '~/config/routes'
import { getUsers } from '~/services/users'
import { getMovies } from '~/services/movies'
import CalDur from '~/utils/CalDur'

function Saved() {
    document.title = titles.saved
    useEffect(() => window.scrollTo(0, 0), [])
    
    const [userAuth] = useState(JSON.parse(localStorage.getItem('auth')))
    const navigate = useNavigate()
    const [savedMovies, setSavedMovies] = useState()

	useEffect(() => {
        if (userAuth === null) {
            navigate(routes.home)
        } else {
            const fetchSavedMovies = async () => {
                const userData = await getUsers(userAuth.email)
                const movieSlugs = userData.data.saved_movies.map(movie => movie.slug_movie)
                const moviePromises = movieSlugs.map(slug => getMovies(slug))
                const movieData = await Promise.all(moviePromises)
                const savedMovies = movieData.map(data => data.data)
                setSavedMovies(savedMovies)
            }
            fetchSavedMovies()
        }
    }, [userAuth, navigate])

    return (
        <div className={clsx(styles.wrapper)}>
            <p>Saved movie</p>
            <ul className={clsx(styles.movieList)} style={{display: savedMovies ? '' : 'block'}}>
                {savedMovies ? savedMovies.map((movie, index) => (
                    <li key={index}><Link to={`${routes.movie.replace('/:slug', '')}/${movie.slug}`}>
                        <span className={clsx(styles.country)}><img alt={movie.country} src={`https://flagsapi.com/${movie.country}/flat/64.png`}/></span>
                        <span className={clsx(styles.rating)}><FontAwesomeIcon icon={faStar}/>{movie.rating}</span>
                        <span className={clsx(styles.duration)}><FontAwesomeIcon icon={faClock}/>{CalDur(movie.duration)}</span>
                        <img alt={movie.title} src={movie.thumbnail}/>
                        <h3>{movie.title}</h3>
                    </Link></li>
                )) : 'You have not saved any movie.'}
            </ul>
        </div>
    )
}

export default Saved