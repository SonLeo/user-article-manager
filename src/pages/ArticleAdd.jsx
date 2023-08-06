import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ArticleAdd() {
    const navigate = useNavigate()
    const { userId } = useParams()
    const [articles, setArticles] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(userId)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async() => {
            const response = await axios.get('http://localhost:3001/users')
            setUsers(response.data)
        }
        fetchUsers()
    }, [])

    useEffect(() => {
        const fetchUserArticles = async() => {
            const response = await axios.get('http://localhost:3001/articles')
            const userArticles = response.data.filter(article => article.user_id === parseInt(userId))
            setArticles(userArticles)
            setLoading(false)
        }
        fetchUserArticles()
    }, [userId])

    const validate = values => {
        const errors = {}
        const found = articles.find(article => article.title === values.title)

        if(!values.title) {
            errors.title = 'Title required!'
        } else if (found) {
            errors.title ='Article already exists!'
        }

        if(!values.content) {
            errors.content = 'Content required!'
        }

        return errors
    }

    const handleSubmit = async(values) => {
        try {
            await axios.post('http://localhost:3001/articles', {
                title: values.title,
                content: values.content,
                user_id: parseInt(selectedUser)
            })
            alert('Add article successfully!')
            navigate(`/edit/${selectedUser}`)
        } catch (error) {
            alert(error)
        }
    }

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    return loading? ('Loading...') : (
        <Formik
            initialValues={{
                title: '',
                content: '',
            }}
            validate={validate}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
                <div className='main'>
                    <div className='content'>
                        <form className='form' onSubmit={handleSubmit}>
                            <Link className='home' to='/'>Home</Link>
                            <h1 className='heading'>Add new article</h1>
                            <div className='form-group'>
                                <label htmlFor='user-select' className='form-label'>User</label>
                                <select id='user-select' className='form-control' value={selectedUser} onChange={handleUserChange}>
                                    {users.map(user => (
                                        <option value={user.id} key={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={`form-group ${errors.title && touched.title ? 'invalid' : ''} `}>
                                <label htmlFor='title' className='form-label'>Title</label>
                                <input
                                    type='text'
                                    id='title'
                                    name='title'
                                    placeholder='Input title'
                                    className='form-control'
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />

                                {errors.title && touched.title && <span className='form-message'>{errors.title}</span>}
                            </div>

                            <div className={`form-group ${errors.content && touched.content ? 'invalid' : ''}`}>
                                <label htmlFor='content' className='form-label'>Content</label>
                                <textarea 
                                    cols={20} rows={5}
                                    className='form-control' 
                                    name='content' 
                                    id='content'
                                    value={values.content}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                ></textarea>

                                {errors.content && touched.content && <span className='form-message'>{errors.content}</span>}
                            </div>
                            <div className='btns'>
                                <button className='btn btn--add' type='submit'>Add Article</button>
                                <Link to={`/edit/${userId}`}><button type='button' className='btn btn--cancel'>Cancel</button></Link>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Formik>
    )
}
