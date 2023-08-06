import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function UserDetail() {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({ name: '' })
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { userId } = useParams()

    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:3001/users')
        setUsers(response.data)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        axios
            .get(`http://localhost:3001/users/${userId}`)
            .then(response => {
                setUser({
                    name: response.data.name
                })
            })

        axios
            .get('http://localhost:3001/articles')
            .then(response => {
                const userArticles = response.data.filter(article => article.user_id === parseInt(userId))
                setArticles(userArticles)
                setLoading(false)
            })
    }, [userId])

    const validate = values => {
        const errors = {}
        const found = users.find(user => user.name === values.name)

        if (!values.name) {
            errors.name = 'Username required'
        } else if (found && (values.name !== user.name)) {
            errors.name = 'Username already exists!'
        }

        return errors
    }

    const handleUpdate = async (values) => {
        await axios.put(`http://localhost:3001/users/${userId}`, { name: values.name })
        navigate('/')
    }

    const deleteArticle = async (id) => {
        await axios.delete(`http://localhost:3001/articles/${id}`)
        setArticles(articles.filter(article => article.id !== id));
    }

    return loading ? ('Loading...') : (
        <Formik
            initialValues={user}
            validate={validate}
            onSubmit={handleUpdate}
            enableReinitialize={true}
        >
            {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
                <div className='main'>
                    <div className='content'>
                        <form className='form' onSubmit={handleSubmit}>
                        <Link className='home' to='/'>Home</Link>
                        <h1 className='heading'>User Detail</h1>
                            <div className={`form-group ${errors.name && touched.name ? 'invalid' : ''}`}>
                                <label className='form-label' htmlFor='name'>Username</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    id='name'
                                    placeholder='Input new Username'
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.name && touched.name && <span className='form-message'>{errors.name}</span>}
                                <button className='btn btn-form-submit' type='submit'>Update</button>
                            </div>
                        <div className='articles'>
                            <h2 className='sub-heading'>Articles</h2>
                            <Link to={`/${userId}/article/add`}><button className='btn btn--add'>New Article</button></Link>
                        </div>
                        {articles.length === 0 ? (<p className='none-article'>There are no articles yet!</p>) : (
                            <table>
                            <thead>
                                <tr>
                                    <th>Article</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map(article => (
                                    <tr key={article.id}>
                                        <td>{article.title}</td>
                                        <td>
                                            <Link to={`/${userId}/article/edit/${article.id}`}><button className='btn btn--edit'>Edit</button></Link>
                                            <button className='btn btn--delete' onClick={() => deleteArticle(article.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                        </form>
                    </div>
                </div>
            )}
        </Formik>
    )
}
