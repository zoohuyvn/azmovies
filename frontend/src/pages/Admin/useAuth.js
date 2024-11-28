import { useState } from 'react'

function useAuth() {
    const getAuth = () => {
		const authStr = localStorage.getItem('auth')
		const userAuth = JSON.parse(authStr)
		return userAuth?.auth
    }
	
    const [auth, setAuth] = useState(getAuth())

    const saveAuth = userAuth => {
		localStorage.setItem('auth', JSON.stringify(userAuth))
		setAuth(userAuth)
    }

    return {
		setAuth: saveAuth,
		auth
    }
}

export default useAuth