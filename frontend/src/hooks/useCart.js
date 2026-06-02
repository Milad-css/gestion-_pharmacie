import { useState, useEffect } from 'react'
import api from '../api/axios'

export function useCart() {
  const [cart, setCart] = useState({ items: [], total: 0 })

  function fetchCart() {
    if (!localStorage.getItem('user')) {
      setCart({ items: [], total: 0 })
      return
    }
    api.get('/cart')
      .then(({ data }) => setCart(data))
      .catch(() => setCart({ items: [], total: 0 }))
  }

  useEffect(() => {
    fetchCart()
    window.addEventListener('auth-change', fetchCart)
    window.addEventListener('cart-change', fetchCart)
    return () => {
      window.removeEventListener('auth-change', fetchCart)
      window.removeEventListener('cart-change', fetchCart)
    }
  }, [])

  function addToCart(productId, quantite) {
    return api.post('/cart', { product_id: productId, quantite: quantite || 1 })
      .then(() => {
        fetchCart()
      })
  }

  function updateItem(id, quantite) {
    return api.put('/cart/' + id, { quantite: quantite })
      .then(() => {
        fetchCart()
      })
  }

  function removeItem(id) {
    return api.delete('/cart/' + id)
      .then(() => {
        fetchCart()
        window.dispatchEvent(new Event('cart-change'))
      })
  }

  function clearCart() {
    return api.delete('/cart')
      .then(() => {
        setCart({ items: [], total: 0 })
      })
  }

  const itemCount = cart.items.reduce((total, item) => total + item.quantite, 0)

  return { cart, itemCount, addToCart, updateItem, removeItem, clearCart }
}
