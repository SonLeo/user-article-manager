import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ArticleEdit() {
    const [users, setUsers] = useState([])
    const [articles, setArticles] = useState([])
    const [article, setArticle] = useState({ title: '', content: '', user_id: '' })
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { articleId } = useParams()

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.get('http://localhost:3001/users')
            setUsers(response.data)
        }
        fetchUsers()
    }, [])

    useEffect(() => {
        const fetchUserArticles = async () => {
            const response = await axios.get('http://localhost:3001/articles')
            const userArticles = response.data.filter(article => article.user_id === parseInt(selectedUser))
            setArticles(userArticles)
        }
        fetchUserArticles()
    }, [selectedUser])

    useEffect(() => {
        const fetchEditArticle = async () => {
            const response = await axios.get(`http://localhost:3001/articles/${articleId}`)
            setArticle({
                title: response.data.title,
                content: response.data.content,
                user_id: response.data.user_id
            })
            setSelectedUser(response.data.user_id)
            setLoading(false)
        }
        fetchEditArticle()
    }, [articleId])

    const validate = values => {
        const errors = {}
        const found = articles.find(article => article.title === values.title)

        if (!values.title) {
            errors.title = 'Title required!'
        } else if (found && (article.title !== values.title)) {
            errors.title = 'Article already exists!'
        }

        if (!values.content) {
            errors.content = 'Content required!'
        }

        return errors
    }

    const handleSubmit = async (values) => {
        try {
            await axios.put(`http://localhost:3001/articles/${articleId}`, {
                title: values.title,
                content: values.content,
                user_id: parseInt(article.user_id)
            })
            alert('Edit article successfully!')
            navigate(`/edit/${article.user_id}`)
        } catch (error) {
            alert(error)
        }
    }

    return loading ? ('Loading...') : (
        <Formik
            initialValues={article}
            validate={validate}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
                <div className='main'>
                    <div className='content'>
                        <form className='form' onSubmit={handleSubmit}>
                            <Link className='home' to='/'>Home</Link>
                            <h1 className='heading'>Edit Article</h1>
                            <div className='form-group'>
                                <label htmlFor='user-select' className='form-label'>User</label>
                                <select
                                    id='user-select'
                                    className='form-control'
                                    value={selectedUser}
                                    onChange={(e) => {
                                        setSelectedUser(e.target.value);
                                        setArticle({
                                            ...article,
                                            user_id: e.target.value,
                                        });
                                    }}>
                                    {users.map(user => (
                                        <option value={user.id} key={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={`form-group ${errors.title && touched.title ? 'invalid' : ''}`}>
                                <label htmlFor='title' className='form-label'>Title</label>
                                <input
                                    type='text'
                                    id='title'
                                    name='title'
                                    placeholder='Input new title'
                                    className='form-control'
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />

                                {errors.title && touched.title && <span className='form-message'>{errors.title}</span>}
                            </div>

                            <div className={`form-group ${errors.content && touched.content ? 'invalid' : ''}`}>
                                <textarea
                                    cols={20} rows={5}
                                    className='form-control'
                                    id='content'
                                    name='content'
                                    value={values.content}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                ></textarea>

                                {errors.content && touched.content && <span className='form-message'>{errors.content}</span>}
                            </div>

                            <div className='btns'>
                                <button className='btn btn--add' type='submit'>Save</button>
                                <Link to={`/edit/${article.user_id}`}><button type='button' className='btn btn--cancel'>Cancel</button></Link>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Formik>
    )
}