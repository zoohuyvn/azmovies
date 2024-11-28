import clsx from 'clsx'
import styles from './Profile.module.scss'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import titles from '~/config/titles'
import routes from '~/config/routes'
import { getUsers, updateUsers } from '~/services/users'
import { Toast } from '~/utils/Noti'

function Profile() {
    document.title = titles.profile
    useEffect(() => window.scrollTo(0, 0), [])
    
    const [userAuth] = useState(JSON.parse(localStorage.getItem('auth')))
    const navigate = useNavigate()
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const oldPasswordRef = useRef(null)
    const newPasswordRef = useRef(null)
	const mounted = useRef(true)

	useEffect(() => {
		if (userAuth === null) {
			navigate(routes.home)
		}
	}, [userAuth])

    const handleSubmit = async e => {
        e.preventDefault()
        if (firstNameRef.current.value.trim() === '') {
			Toast('warning', 'Please provided first name.')
			return
		}
        if (lastNameRef.current.value.trim() === '') {
			Toast('warning', 'Please provided last name.')
			return
		}
        if (oldPasswordRef.current.value.trim() === '') {
			Toast('warning', 'Please provided old password.')
			return
		}
        if (newPasswordRef.current.value.trim() === '') {
			Toast('warning', 'Please provided new password.')
			return
		}
        const updateInfo = {
            first_name: firstNameRef.current.value,
            last_name: lastNameRef.current.value,
            old_password: oldPasswordRef.current.value,
            password: newPasswordRef.current.value,
            token: userAuth.token
        }
        const data = await updateUsers(updateInfo, 'PUT', userAuth.email)
        if (data.status) Toast('success', "Update infomation successful.")
        else Toast('error', data.message)
        if (mounted.current) {
			firstNameRef.current.value = ''
			lastNameRef.current.value = ''
			oldPasswordRef.current.value = ''
			newPasswordRef.current.value = ''
        }
    }

    return (
        <form className={clsx(styles.wrapper)} onSubmit={e => handleSubmit(e)}>
            <input type='text' placeholder='First name' ref={firstNameRef}/>
            <input type='text' placeholder='Last name' ref={lastNameRef}/>
            <input type='password' placeholder='Old password' ref={oldPasswordRef}/>
            <input type='password' placeholder='New password' ref={newPasswordRef}/>
            <button className='btn'>Update</button>
        </form>
    )
}

export default Profile