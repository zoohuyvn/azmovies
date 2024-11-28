import routers from '~/config/routes'
import Register from '~/pages/Register'
import Login from '~/pages/Login'
import Home from '~/pages/Home'
import Movie from '~/pages/Movie'
import Profile from '~/pages/Profile'
import Love from '~/pages/Love'
import Saved from '~/pages/Saved'
import Histories from '~/pages/Histories'
import Dashboard from '~/pages/Admin'

const publicRoutes = [
    { path: routers.register, component: Register, layout: null },
    { path: routers.login, component: Login, layout: null },
    { path: routers.home, component: Home },
    { path: routers.movie, component: Movie },
    { path: routers.profile, component: Profile },
    { path: routers.love, component: Love },
    { path: routers.saved, component: Saved },
    { path: routers.histories, component: Histories },
]

const privateRoutes = [
    { path: routers.dashboard, component: Dashboard }
]

export { publicRoutes, privateRoutes }