import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik } from 'formik'
import axios from 'axios'

export default function UserAdd() {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:3001/users')
        setUsers(response.data)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const validate = values => {
        const errors = {}
        const found = users.find(user => (user.name === values.name))

        if (!values.name) {
            errors.name = 'Username required!'
        } else if (found) {
            errors.name = 'Username already exists!'
        }

        return errors
    }

    const handleSubmit = async (values) => {
        try {
            await axios.post('http://localhost:3001/users', { name: values.name })
            const newUsers = (await axios.get('http://localhost:3001/users')).data
            const user = newUsers.find(user => user.name === values.name)
            alert('Add user successfully!')
            navigate(`/edit/${user.id}`)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <Formik
            initialValues={{ name: '' }}
            validate={validate}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
                <div className='main'>
                    <form className='form' onSubmit={handleSubmit}>
                        <Link className='home' to='/'>Home</Link>
                        <h1 className='heading'>Create User</h1>
                        <div className={`form-group ${errors.name && touched.name ? 'invalid' : ''}`}>
                            <label className='form-label' htmlFor='name'>Name</label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                className='form-control'
                                value={values.name}
                                placeholder='Input user name'
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            {errors.name && touched.name && <span className='form-message'>{errors.name}</span>}
                        </div>

                        <button className='btn btn-form-submit' type='submit'>Add User</button>
                    </form>
                </div>
            )}
        </Formik>
    )
}
