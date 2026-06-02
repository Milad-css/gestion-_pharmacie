/**
 * Seed product images from Picsum Photos (free, no API key needed).
 * Each product gets a consistent image based on its name as seed.
 *
 * Usage:
 *   node scripts/seed-images.js
 *
 * Requirements:
 *   npm install axios form-data  (in the frontend folder)
 *
 * Make sure the backend is running at http://localhost:8000
 */

const axios = require('axios')
const FormData = require('form-data')
const https = require('https')
const http = require('http')

const API = 'http://localhost:8000/api'
const ADMIN_EMAIL = 'admin@pharmacie.com'
const ADMIN_PASSWORD = 'password'

// Curated seeds that return good-looking pharmaceutical-style photos from Picsum
const PRODUCT_IMAGE_SEEDS = {
  'Paracétamol 500mg':       'medicine-white-tablet',
  'Ibuprofène 400mg':        'pharmacy-orange-pill',
  'Aspirine 500mg':          'aspirin-round-tablet',
  'Amoxicilline 500mg':      'antibiotic-capsule-blue',
  'Azithromycine 250mg':     'antibiotic-blister-pack',
  'Vitamine C 1000mg':       'vitamin-orange-effervescent',
  'Vitamine D3 1000 UI':     'vitamin-d-supplement-yellow',
  'Magnésium B6':            'magnesium-white-tablet',
  'Biafine Émulsion':        'cream-tube-white',
  'Cetaphil Crème Hydratante':'moisturizer-cream-jar',
  'Amlodipine 5mg':          'cardiology-pill-round',
  'Metformine 850mg':        'diabetes-medication-tablet',
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const chunks = []
    const lib = url.startsWith('https') ? https : http
    lib.get(url, (res) => {
      // Follow redirect
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location).then(resolve).catch(reject)
      }
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), type: res.headers['content-type'] || 'image/jpeg' }))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function run() {
  console.log('🔐 Authenticating as admin...')
  const { data: auth } = await axios.post(`${API}/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  })
  const token = auth.token
  const headers = { Authorization: `Bearer ${token}` }

  console.log('📦 Fetching products...')
  const { data: paged } = await axios.get(`${API}/products?per_page=100`, { headers })
  const products = paged.data

  console.log(`Found ${products.length} products. Uploading images...\n`)

  for (const product of products) {
    const seed = PRODUCT_IMAGE_SEEDS[product.nom] || product.nom.toLowerCase().replace(/\s+/g, '-')
    const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/600`

    try {
      process.stdout.write(`  ⬇  ${product.nom}... `)
      const { buffer, type } = await downloadImage(imageUrl)

      const fd = new FormData()
      fd.append('_method', 'PUT')
      fd.append('nom', product.nom)
      fd.append('prix', product.prix)
      fd.append('stock', product.stock)
      if (product.category_id) fd.append('category_id', product.category_id)
      fd.append('image', buffer, { filename: `${seed}.jpg`, contentType: type })

      await axios.post(`${API}/products/${product.id}`, fd, {
        headers: { ...headers, ...fd.getHeaders() },
      })

      console.log('✅')
    } catch (err) {
      console.log(`❌ ${err.message}`)
    }
  }

  console.log('\n✨ Done! Refresh the app to see the images.')
}

run().catch(err => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
