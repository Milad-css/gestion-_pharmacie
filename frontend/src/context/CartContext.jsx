import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], total: 0 })

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart')
      setCart(data)
    } catch {
      setCart({ items: [], total: 0 })
    }
  }

  useEffect(() => {
    if (user) fetchCart()
    else setCart({ items: [], total: 0 })
  }, [user])

  const addToCart = async (productId, quantite = 1) => {
    await api.post('/cart', { product_id: productId, quantite })
    await fetchCart()
  }

  const updateItem = async (id, quantite) => {
    await api.put(`/cart/${id}`, { quantite })
    await fetchCart()
  }

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`)
    await fetchCart()
  }

  const clearCart = async () => {
    await api.delete('/cart')
    setCart({ items: [], total: 0 })
  }

  const itemCount = cart.items.reduce((s, i) => s + i.quantite, 0)

  return (
    <CartContext.Provider value={{ cart, itemCount, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
