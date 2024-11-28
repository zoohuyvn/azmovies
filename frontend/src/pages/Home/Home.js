import clsx from 'clsx'
import styles from './Home.module.scss'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import titles from '~/config/titles'
import routes from '~/config/routes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faStar } from '@fortawesome/free-solid-svg-icons'
import { getMovies } from '~/services/movies'
import CalDur from '~/utils/CalDur'

function Home() {
    document.title = titles.home
    useEffect(() => window.scrollTo(0, 0), [])

    const [movies, setMovies] = useState()
    const [genres, setGenres] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedGenres, setSelectedGenres] = useState([])
    const [selectedCountries, setSelectedCountries] = useState([])
	const mounted = useRef(true)
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get('keyword')

    useEffect(() => {
		mounted.current = true
		getMovies()
		.then(items => {
			if(mounted.current) setMovies(items.data)
		})
		return () => mounted.current = false
	}, [])

    useEffect(() => {
        if (!movies) return
		const ulSlide = document.querySelectorAll(`ul.${clsx(styles.movieScroll)} li`)
        const spanList = document.querySelectorAll(`.${clsx(styles.movieScrollNavigate)} span`)
        let index = 0
        let intervalId = setInterval(() => {
            index !== 0 && spanList[index - 1].classList.remove(clsx(styles.active))
            index !== 0 && (ulSlide[index - 1].classList.remove(clsx(styles.active)))

            spanList[index].classList.add(clsx(styles.active))
            ulSlide[index].classList.add(clsx(styles.active))
            index = (index + 1) % 6

            if (index === 0) {
                ulSlide[0].classList.add(clsx(styles.active))
                spanList[0].classList.add(clsx(styles.active))

                ulSlide[5].classList.remove(clsx(styles.active))
                spanList[5].classList.remove(clsx(styles.active))
            }
        }, 3000)
        return () => clearInterval(intervalId)
    }, [movies])

    useEffect(() => {
        if (movies) {
            const uniqueGenres = [...new Set(movies.map(movie => movie.genre))]
            setGenres(uniqueGenres)
            const uniqueCountries = [...new Set(movies.map(movie => movie.country))]
            setCountries(uniqueCountries)
        }
    }, [movies])

    const handleGenreChange = (genre) => {
        setSelectedGenres(prevGenres => {
            if (prevGenres.includes(genre)) {
                return prevGenres.filter(g => g !== genre)
            } else {
                return [...prevGenres, genre]

            }
        })
    }

    const handleCountryChange = (country) => {
        setSelectedCountries(prevCountries => {
            if (prevCountries.includes(country)) {
                return prevCountries.filter(c => c !== country)
            } else {
                return [...prevCountries, country]
            }
        })
    }

    const handleUncheckAllGenres = () => {
        setSelectedGenres([])
    }

    const handleUncheckAllCountries = () => {
        setSelectedCountries([])
    }

    useEffect(() => {
        if (keyword) document.querySelector('p.keyword').scrollIntoView()
    }, [keyword])

    return (
        <div className={clsx(styles.wrapper)}>
            <div className={clsx(styles.movie)}>
                <ul className={clsx(styles.movieScroll)}>
                    {movies && movies
                                .filter(movie => movie.released)
                                .sort((a, b) => new Date(b.released) - new Date(a.released))
                                .slice(0, 5)
                                .map((movie, index) => (
                        <li className={index === 0 ? clsx(styles.active) : ''} key={index}><Link to={`${routes.movie.replace('/:slug', '')}/${movie.slug}`}>
                            <img alt={movie.title} src={movie.thumbnail}/>
                            <h2>{movie.title}<span>- {movie.released}</span><label>{movie.description}</label></h2>
                        </Link></li>
                    ))}
                    <li style={{display: 'none'}}></li>
                    <div className={clsx(styles.movieScrollNavigate)}>
                        <span className={clsx(styles.active)}></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span style={{display: 'none'}}></span>
                    </div>
                </ul>
                <p>Top movie</p>
                <ul className={clsx(styles.movieList)}>
                    {movies && movies
                                .filter(movie => movie.rating)
                                .sort((a, b) => b.rating - a.rating)
                                .slice(0, 6)
                                .map((movie, index) => (
                        <li key={index}><Link to={`${routes.movie.replace('/:slug', '')}/${movie.slug}`}>
                            <span className={clsx(styles.country)}><img alt={movie.country} src={`https://flagsapi.com/${movie.country}/flat/64.png`}/></span>
                            <span className={clsx(styles.rating)}><FontAwesomeIcon icon={faStar}/>{movie.rating}</span>
                            <span className={clsx(styles.duration)}><FontAwesomeIcon icon={faClock}/>{CalDur(movie.duration)}</span>
                            <img alt={movie.title} src={movie.thumbnail}/>
                            <h3>{movie.title}</h3>
                        </Link></li>
                    ))}
                </ul><p className='keyword'>{keyword ? `Result for: ${keyword}` : 'All movie'}</p>
                <ul className={clsx(styles.movieList)}>
                    {movies && movies.filter(movie => 
                            (selectedGenres.length === 0 || selectedGenres.includes(movie.genre)) &&
                            (selectedCountries.length === 0 || selectedCountries.includes(movie.country))
                        ).filter(movie => {
                            if (keyword) {
                                const searchString = `${movie.title} ${movie.description} ${movie.genre} ${movie.country}`.toLowerCase()
                                return searchString.includes(keyword.toLowerCase())
                            } else {
                                return movie
                            }
                        }).map((movie, index) => (
                        <li key={index}><Link to={`${routes.movie.replace('/:slug', '')}/${movie.slug}`}>
                            <span className={clsx(styles.country)}><img alt={movie.country} src={`https://flagsapi.com/${movie.country}/flat/64.png`}/></span>
                            <span className={clsx(styles.rating)}><FontAwesomeIcon icon={faStar}/>{movie.rating}</span>
                            <span className={clsx(styles.duration)}><FontAwesomeIcon icon={faClock}/>{CalDur(movie.duration)}</span>
                            <img alt={movie.title} src={movie.thumbnail}/>
                            <h3>{movie.title}</h3>
                        </Link></li>
                    ))}
                </ul>
            </div>
            <div className={clsx(styles.genresCountries)}>
                <div className={clsx(styles.genresCountriesBox)}>
                    <div className={clsx(styles.genresCountriesBoxHead)}>
                        <h4>Genres</h4>
                        <span onClick={handleUncheckAllGenres}>Uncheck all</span>
                    </div>
                    <div className={clsx(styles.genresCountriesBoxBody)}>
                        {genres && genres.map(genre =>
                            <label key={genre}>{genre}
                                <input type='checkbox' checked={selectedGenres.includes(genre)} onChange={() => handleGenreChange(genre)}/>
                            </label>
                        )}
                    </div>
                </div>
                <div className={clsx(styles.genresCountriesBox)}>
                    <div className={clsx(styles.genresCountriesBoxHead)}>
                        <h4>Countries</h4>
                        <span onClick={handleUncheckAllCountries}>Uncheck all</span>
                    </div>
                    <div className={clsx(styles.genresCountriesBoxBody)}>
                        {countries && countries.map(country =>
                            <label key={country}>{country}
                                <input type='checkbox' checked={selectedCountries.includes(country)} onChange={() => handleCountryChange(country)}/>
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home