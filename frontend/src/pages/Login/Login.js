import clsx from 'clsx'
import styles from '../Register/Register.module.scss'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import titles from '~/config/titles'
import routes from '~/config/routes'
import loginBg from '~/assets/images/login.jpg'
import useAuth from '../Admin/useAuth'
import { updateUsers } from '~/services/users'
import { Toast } from '~/utils/Noti'

function Login() {
    document.title = titles.login
    useEffect(() => window.scrollTo(0, 0), [])

    const [userAuth] = useState(JSON.parse(localStorage.getItem('auth')))
    const navigate = useNavigate()
	const { setAuth } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailWarning, setEmailWarning] = useState(null)
    const [passwordWarning, setPasswordWarning] = useState(null)

    useEffect(() => {
        if (userAuth) navigate(routes.home)
    }, [userAuth])

    const handleSubmit = async e => {
        e.preventDefault()
        let emailValidate = String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
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
        let isValidate = emailValidate !== null && password.trim().length >= 6
        if (email && password && isValidate) {
			const data = await updateUsers({
                email,
				password
			}, 'POST')
            if (data.status) {
                setAuth(data.data)
                Toast('success', 'Login successful.')
                navigate(routes.home)
            } else {
                Toast('error', data.message)
            }
		}
    }

    return (
        <div className={clsx(styles.wrapper)}>
            <div className={clsx(styles.image, styles.login)}>
                <img alt='' src={loginBg}/>
            </div>
            <div className={clsx(styles.form)}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
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
                    <button>Login</button>
                </form>
                <p>Don't have an account? <Link to={routes.register}>Sign up for free</Link></p>
            </div>
        </div>
    )
}

export default Login