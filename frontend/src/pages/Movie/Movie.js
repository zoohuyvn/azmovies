import clsx from 'clsx'
import styles from './Movie.module.scss'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import titles from '~/config/titles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faHeart, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { getMovies } from '~/services/movies'
import CalDur from '~/utils/CalDur'
import { Dialog, Toast } from '~/utils/Noti'
import { deleteComments, postComments } from '~/services/comments'
import { getUsers } from '~/services/users'
import { deleteLoveMovies, postLoveMovies } from '~/services/loveMovies'
import { deleteSavedMovies, postSavedMovies } from '~/services/savedMovies'

function Movie() {
    const [userAuth] = useState(JSON.parse(localStorage.getItem('auth')))
    const { slug } = useParams()
    const [movie, setMovie] = useState([])
    const commentInputRef = useRef(null)
	const mounted = useRef(true)
    const [commenters, setCommenters] = useState({})
    const [lovedSaved, setLovedSaved] = useState({})

	useEffect(() => {
		mounted.current = true
		getMovies()
		.then(items => {
			if(mounted.current) {
                const findItem = items.data.find(item => item.slug === slug)
                setMovie(findItem)
            }
		})
		return () => mounted.current = false
	}, [slug])

    document.title = movie.title + titles.default
    useEffect(() => window.scrollTo(0, 0), [])

    const handleCommentSubmit = async e => {
        e.preventDefault()
        if (commentInputRef.current.value.trim() === '') {
			Toast('warning', 'Comment can\'t be blank.')
			return
		}
        const newComment = {
            user_email: userAuth.email,
            slug_movie: movie.slug,
            content: commentInputRef.current.value,
            token: userAuth.token
        }
        const data = await postComments(newComment)
        if (!data.status) Toast('error', data.message)
        if (mounted.current) {
			commentInputRef.current.value = ''
        }
        getMovies().then(items => {
			const findItem = items.data.find(item => item.slug === slug)
            setMovie(findItem)
		})
    }

    useEffect(() => {
        const fetchCommenterNames = async () => {
            if (movie.comments) {
                const uniqueEmails = [...new Set(movie.comments.map(comment => comment.user_email))]
                const commenterData = {}
                for (const email of uniqueEmails) {
                    const data = await getUsers(email)
                    commenterData[email] = {
                        fullname: `${data.data.first_name} ${data.data.last_name}`,
                        role: data.data.role
                    }
                }
                setCommenters(commenterData)
            }
        }
        const fetchLovedSaved = async () => {
            const data = await getUsers(userAuth ? userAuth.email : 'x')
            if (data.status) setLovedSaved({
                isLoved: data.data.love_movies.some(mv => mv.slug_movie === slug && mv.user_email === userAuth.email),
                isSaved: data.data.saved_movies.some(mv => mv.slug_movie === slug && mv.user_email === userAuth.email)
            })
        }
        fetchCommenterNames()
        fetchLovedSaved()
    }, [movie, slug])

    const handleDelete = async commentContent => {
		const resConfirmed = await Dialog('Confirm deletion', 'Are you sure you want to delete this comment?')
		if (resConfirmed) {
			const data = await deleteComments({token: userAuth.token}, userAuth.email, slug, commentContent)
			if (data.status) {
				getMovies().then(items => {
                    const findItem = items.data.find(item => item.slug === slug)
                    setMovie(findItem)
                })
				Toast('success', 'Delete comment successful.')
			} else {
				Toast('error', data.message)
			}
		}
	}

    const handleLoveMovie = async () => {
		if (userAuth) {
            if (lovedSaved.isLoved) {
                const data = await deleteLoveMovies({token: userAuth.token}, userAuth.email, slug)
                if (data.status) {
                    Toast('success', 'Unloved.')
                    document.querySelector(`.${styles.action} svg:first-of-type`).classList.remove(clsx(styles.active))
                } else {
                    Toast('error', data.message)
                }
            } else {
                const data = await postLoveMovies({
                    user_email: userAuth.email,
                    slug_movie: slug,
                    token: userAuth.token
                })
                if (data.status) {
                    Toast('success', 'Loved.')
                    document.querySelector(`.${styles.action} svg:first-of-type`).classList.add(clsx(styles.active))
                } else {
                    Toast('error', data.message)
                }
            }
        } else Dialog('Limit feature', 'Please login to love this movie.')
	}

    const handleSavedMovie = async () => {
		if (userAuth) {
            if (lovedSaved.isSaved) {
                const data = await deleteSavedMovies({token: userAuth.token}, userAuth.email, slug)
                if (data.status) {
                    Toast('success', 'Unsaved.')
                    document.querySelector(`.${styles.action} svg:last-of-type`).classList.remove(clsx(styles.active))
                } else {
                    Toast('error', data.message)
                }
            } else {
                const data = await postSavedMovies({
                    user_email: userAuth.email,
                    slug_movie: slug,
                    token: userAuth.token
                })
                if (data.status) {
                    Toast('success', 'Saved.')
                    document.querySelector(`.${styles.action} svg:last-of-type`).classList.add(clsx(styles.active))
                } else {
                    Toast('error', data.message)
                }
            }
        } else Dialog('Limit feature', 'Please login to save this movie.')
	}

    return (
        <div className={clsx(styles.wrapper)}>
            <div className={clsx(styles.movie)}>
                <iframe src={movie.url} title='a' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
            <div className={clsx(styles.info)}>
                <div>
                    <div className={clsx(styles.head)}>
                        <h2>{movie.title}</h2>
                        <div className={clsx(styles.tag)}>
                            <span>{movie.genre}</span>
                            <span>{movie.country}</span>
                        </div>
                        <div className={clsx(styles.action)}>
                            <FontAwesomeIcon className={lovedSaved.isLoved ? clsx(styles.active) : ''} icon={faHeart} onClick={handleLoveMovie}/>
                            <FontAwesomeIcon className={lovedSaved.isSaved ? clsx(styles.active) : ''} icon={faBookmark} onClick={handleSavedMovie}/>
                        </div>
                    </div>
                    <p>{movie.description}</p>
                    <p>Duration: <span>{CalDur(movie.duration)}</span></p>
                    <p>Released: <span>{movie.released}</span></p>
                    <p>Star: <FontAwesomeIcon icon={faStar}/><span>{movie.rating}</span></p>
                </div>
                <div className={clsx(styles.comments)}>
                    <h4>{userAuth ? 'Comments' : 'Login to comment'}</h4>
                    {userAuth &&
                        <form className={clsx(styles.form)} onSubmit={e => handleCommentSubmit(e)}>
                            <input type='text' placeholder='Thinking about this movies...' ref={commentInputRef}/>
                            <button className='btn'>Send</button>
                        </form>
                    }
                    <ul>
                        {movie.comments && movie.comments.map((comment, index) => (
                            <li key={index}>
                                <div className={clsx(styles.commentHead)}>
                                    <img alt={comment.content} src={`https://ui-avatars.com/api/?background=${commenters[comment.user_email]?.role === 1 ? '000000' : '6694F0'}&color=fff&name=${commenters[comment.user_email]?.fullname}`}/>
                                    <h3>{commenters[comment.user_email]?.fullname || 'Loading...'}<span>{comment.datetime}</span></h3>
                                </div>
                                <p>{comment.content}</p>
                                {userAuth && userAuth.email === comment.user_email ? <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(comment.content)}/> : ''}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Movie