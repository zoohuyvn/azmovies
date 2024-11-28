import clsx from 'clsx'
import styles from './Register.module.scss'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import titles from '~/config/titles'
import routes from '~/config/routes'
import registerBg from '~/assets/images/register.jpg'
import useAuth from '../Admin/useAuth'
import { Toast } from '~/utils/Noti'
import { updateUsers } from '~/services/users'

function Register() {
    document.title = titles.register
    useEffect(() => window.scrollTo(0, 0), [])

    const [userAuth] = useState(JSON.parse(localStorage.getItem('auth')))
    const navigate = useNavigate()
	const { setAuth } = useAuth()
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstNameWarning, setFirstNameWarning] = useState(null)
    const [lastNameWarning, setLastNameWarning] = useState(null)
    const [emailWarning, setEmailWarning] = useState(null)
    const [passwordWarning, setPasswordWarning] = useState(null)

    useEffect(() => {
        if (userAuth) navigate(routes.home)
    }, [userAuth])

    const handleSubmit = async e => {
        e.preventDefault()
        let emailValidate = String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		if (!first_name || first_name.trim() === '') {
			setFirstNameWarning('Please provide firts name.')
		} else if (first_name.trim().length < 3) {
			setFirstNameWarning('First name at least 3 characters.')
        }
		if (!last_name || last_name.trim() === '') {
			setLastNameWarning('Please provide last name.')
		} else if (last_name.trim().length < 3) {
			setLastNameWarning('Last name at least 3 characters.')
        }
		if (!email || email.trim() === '') {
			setEmailWarning('Please provide email.')
		} else if (!emailValidate) {
			setEmailWarning('Please provide valid email.')
        }
		if (!password || password.trim() === '') {
			setPasswordWarning('Please provide password.')
		} else if (password.trim().length < 6) {
			setPasswordWarning('Password at least 6 characters.')
        }
        let isValidate = first_name.trim().length >= 3 && last_name.trim().length >= 3 && emailValidate !== null && password.trim().length >= 6
        if (first_name && last_name && email && password && isValidate) {
			const data = await updateUsers({
				first_name,
                last_name,
                email,
				password
			}, 'POST')
            if (data.status) {
                setAuth(data.data)
                Toast('success', 'Register successful.')
                navigate(routes.home)
            } else {
                Toast('error', data.message)
            }
		}
    }

    return (
        <div className={clsx(styles.wrapper)}>
            <div className={clsx(styles.image)}>
                <img alt='Avatar background' src={registerBg}/>
            </div>
            <div className={clsx(styles.form)}>
                <h1>Create an account</h1>
                <form onSubmit={handleSubmit}>
                    <input type='text' placeholder='First name' value={first_name}
                        onChange={e => {
							setFirstName(e.target.value)
							setFirstNameWarning(null)
						}}
                    />
                    <p className={firstNameWarning && clsx(styles.warning)}>{firstNameWarning}</p>
                    <input type='text' placeholder='Last name' value={last_name}
                        onChange={e => {
							setLastName(e.target.value)
							setLastNameWarning(null)
						}}
                    />
                    <p className={lastNameWarning && clsx(styles.warning)}>{lastNameWarning}</p>
                    <input type='text' placeholder='Email' value={email}
                        onChange={e => {
							setEmail(e.target.value)
							setEmailWarning(null)
						}}
                    />
                    <p className={emailWarning && clsx(styles.warning)}>{emailWarning}</p>
                    <input type='password' placeholder='Password' value={password}
                        onChange={e => {
							setPassword(e.target.value)
							setPasswordWarning(null)
						}}
                    />
                    <p className={passwordWarning && clsx(styles.warning)}>{passwordWarning}</p>
                    <button>Create account</button>
                </form>
                <p>Already have an account? <Link to={routes.login}>Log in</Link></p>
            </div>
        </div>
    )
}

export default Register