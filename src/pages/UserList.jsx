import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function UserList() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async() => {
        const response = await axios.get('http://localhost:3001/users')
        setUsers(response.data)
    }

    const deleteUser = async(id) => {
        await axios.delete(`http://localhost:3001/users/${id}`)
        getUsers()
    }

    return (
        <div className='main'>
            <div className='content'>
                <div className='header'>
                    <h1 className='heading'>Users list</h1>
                    <button className='btn btn--add'><Link to='/add'>Create New</Link></button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>
                                    <Link to={`/edit/${user.id}`}><button className='btn btn--edit'>Edit</button></Link>
                                    <button className='btn btn--delete' onClick={() => deleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}