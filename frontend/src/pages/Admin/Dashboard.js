import clsx from 'clsx'
import styles from './Admin.module.scss'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import titles from '~/config/titles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { getMovies, updateMovies } from '~/services/movies'
import { Dialog, Toast } from '~/utils/Noti'
import Slugify from '~/utils/Slugify'
import routes from '~/config/routes'

function Dashboard() {
    document.title = titles.dashboard
    useEffect(() => window.scrollTo(0, 0), [])

    const [userAuth] = useState(JSON.parse(localStorage.getItem('auth')))
	const navigate = useNavigate()
	const [movies, setMovies] = useState()
	const [editingMovie, setEditingMovie] = useState(null)
	const titleRef = useRef(null)
	const descriptionRef = useRef(null)
	const durationRef = useRef(null)
	const releasedRef = useRef(null)
	const genreRef = useRef(null)
	const countryRef = useRef(null)
	const thumbnailRef = useRef(null)
	const ratingRef = useRef(null)
	const urlRef = useRef(null)
	const submitBtnRef = useRef(null)
	const mounted = useRef(true)

	useEffect(() => {
		if (userAuth === null || userAuth.role === 0) {
			navigate(routes.home)
		}
	}, [userAuth])

	useEffect(() => {
		mounted.current = true
		getMovies()
		.then(items => {
			if(mounted.current) setMovies(items.data)
		})
		return () => mounted.current = false
	}, [])

	const handleSubmit = async e => {
		e.preventDefault()
		if (titleRef.current.value.trim() === '') {
			Toast('warning', 'Please provided title.')
			return
		}
		if (descriptionRef.current.value.trim() === '') {
			Toast('warning', 'Please provided description.')
			return
		}
		if (durationRef.current.value.trim() === '') {
			Toast('warning', 'Please provided duration.')
			return
		}
		if (!isFinite(durationRef.current.value)) {
			Toast('warning', 'Duration must be number.')
			return
		}
		if (releasedRef.current.value.trim() === '') {
			Toast('warning', 'Please provided released.')
			return
		}
		if (genreRef.current.value.trim() === '') {
			Toast('warning', 'Please provided genre.')
			return
		}
		if (countryRef.current.value.trim() === '') {
			Toast('warning', 'Please provided country.')
			return
		}
		if (thumbnailRef.current.value.trim() === '') {
			Toast('warning', 'Please provided thumbnail.')
			return
		}
		if (ratingRef.current.value.trim() === '') {
			Toast('warning', 'Please provided rating.')
			return
		}
		if (ratingRef.current.value < 0 || ratingRef.current.value > 5) {
			Toast('warning', 'Rating must be from 0 to 5.')
			return
		}
		if (urlRef.current.value.trim() === '') {
			Toast('warning', 'Please provided url.')
			return
		}
		const newMovie = {
			title: titleRef.current.value,
			description: descriptionRef.current.value,
			duration: Number(durationRef.current.value),
			released: releasedRef.current.value,
			genre: genreRef.current.value,
			country: countryRef.current.value,
			thumbnail: thumbnailRef.current.value,
			rating: Number(ratingRef.current.value),
			url: urlRef.current.value,
			token: userAuth.token
		}
		if (editingMovie) {
			const data = await updateMovies(newMovie, 'PUT', editingMovie.slug)
			if (data.status) {
				Toast('success', 'Update movie successful.')
			} else {
				Toast('error', data.message)
			}
		} else {
			const data = await updateMovies({...newMovie, slug: Slugify(titleRef.current.value)}, 'POST')
			if (data.status) {
				Toast('success', 'Add movie successful.')
			} else {
				Toast('error', data.message)
			}
		}
		if (mounted.current) {
			titleRef.current.value = ''
			descriptionRef.current.value = ''
			durationRef.current.value = ''
			releasedRef.current.value = ''
			genreRef.current.value = ''
			countryRef.current.value = ''
			thumbnailRef.current.value = ''
			ratingRef.current.value = ''
			urlRef.current.value = ''
		}
		getMovies().then(items => setMovies(items.data))
	}

	const handleEdit = movie => {
		setEditingMovie(movie)
		titleRef.current.value = movie.title
		descriptionRef.current.value = movie.description
		durationRef.current.value = movie.duration
		releasedRef.current.value = movie.released
		genreRef.current.value = movie.genre
		countryRef.current.value = movie.country
		thumbnailRef.current.value = movie.thumbnail
		ratingRef.current.value = movie.rating
		urlRef.current.value = movie.url
		window.scrollTo(0, 0)
	}

	const handleDelete = async movieSlug => {
		const resConfirmed = await Dialog('Confirm deletion', 'Are you sure you want to delete this movie?')
		if (resConfirmed) {
			const data = await updateMovies({token: userAuth.token}, 'DELETE', movieSlug)
			if (data.status) {
				getMovies().then(items => setMovies(items.data))
				Toast('success', 'Delete movie successful.')
			} else {
				Toast('error', data.message)
			}
		}
	}

    return (
        <div className={clsx(styles.wrapper)}>
		<div className={clsx(styles.data)}>
			<table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Title</th>
						<th>Description</th>
						<th>Duration</th>
						<th>Released</th>
						<th>Genre</th>
						<th>Country</th>
						<th>Thumbnail</th>
						<th>Rating</th>
						<th>Url</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody key={movies}>
					{movies && movies.map((movie, index) => (
						<tr key={index}>
							<td>{index + 1}</td>
							<td>{movie.title}</td>
							<td>{movie.description.slice(0, 20)}</td>
							<td>{movie.duration}</td>
							<td>{movie.released}</td>
							<td>{movie.genre}</td>
							<td>{movie.country}</td>
							<td>{movie.thumbnail}</td>
							<td>{movie.rating}</td>
							<td>{movie.url}</td>
							<td>
								<FontAwesomeIcon icon={faPen} onClick={() => handleEdit(movie)}/>
								<FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(movie.slug)}/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
            <form className={clsx(styles.form)} onSubmit={handleSubmit}>
				<input type='text' placeholder='Title' ref={titleRef}/>
				<textarea type='text' placeholder='Description' ref={descriptionRef}></textarea>
				<input type='text' placeholder='Duration' ref={durationRef}/>
				<input type='text' placeholder='Released' ref={releasedRef}/>
				<input type='text' placeholder='Genre' ref={genreRef}/>
				<input type='text' placeholder='Country' ref={countryRef}/>
				<input type='text' placeholder='Thumbnail' ref={thumbnailRef}/>
				<input type='text' placeholder='Rating' ref={ratingRef}/>
				<input type='text' placeholder='Url' ref={urlRef}/>
				<button className='btn' ref={submitBtnRef}>
					{editingMovie ? 'Update' : 'Add'}
				</button>
			</form>
        </div>
    )
}

export default Dashboard