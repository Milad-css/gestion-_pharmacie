import { useState, useEffect } from 'react'
import api from '../api/axios'

export function useAuth() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  useEffect(() => {
    function sync() {
      setUser(JSON.parse(localStorage.getItem('user')))
    }
    }, [])

  function login(email, password) {
    return api.post('/login', { email, password })
      .then(({ data }) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        return data.user
      })
  }

  function register(payload) {
    return api.post('/register', payload)
      .then(({ data }) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        return data.user
      })
  }

  function logout() {
    api.post('/logout').catch(() => {})
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, login, register, logout }
}
