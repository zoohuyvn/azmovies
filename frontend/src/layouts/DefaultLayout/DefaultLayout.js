import Header from '~/layouts/components/Header'
import Footer from '~/layouts/components/Footer'
import PropTypes from 'prop-types'

function DefaultLayout({ children }) {
    return (<>
        <div className='container'>
            <Header/>
            {children}
        </div>
        <Footer/>
    </>)
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default DefaultLayout