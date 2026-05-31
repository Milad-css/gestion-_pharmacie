import { useState, useEffect } from 'react'
import api from '../api/axios'

export function useAuth() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  useEffect(() => {
    function sync() {
      setUser(JSON.parse(localStorage.getItem('user')))
    }
    window.addEventListener('auth-change', sync)
    return () => window.removeEventListener('auth-change', sync)
  }, [])

  function login(email, password) {
    return api.post('/login', { email, password })
      .then(({ data }) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.dispatchEvent(new Event('auth-change'))
        return data.user
      })
  }

  function register(payload) {
    return api.post('/register', payload)
      .then(({ data }) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.dispatchEvent(new Event('auth-change'))
        return data.user
      })
  }

  function logout() {
    api.post('/logout').catch(() => {})
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-change'))
  }

  return { user, login, register, logout }
}
