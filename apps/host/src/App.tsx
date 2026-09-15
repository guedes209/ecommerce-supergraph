import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import './App.css'

const GET_SUPERGRAPH_DATA = gql`
  query GetSupergraphData {
    me {
      id
      username
    }
    products {
      id
      name
      price
      reviews {
        id
        body
        author {
          username
        }
      }
    }
  }
`

const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $price: Float!) {
    createProduct(name: $name, price: $price) {
      id
      name
      price
    }
  }
`

const CREATE_REVIEW = gql`
  mutation CreateReview($productId: ID!, $authorId: ID!, $body: String!) {
    createReview(productId: $productId, authorId: $authorId, body: $body) {
      id
      body
    }
  }
`

interface Review {
  id: string
  body: string
  author: {
    username: string
  }
}

interface Product {
  id: string
  name: string
  price: number
  reviews: Review[]
}

interface SupergraphData {
  me: { id: string; username: string }
  products: Product[]
}

function App() {
  const { loading, error, data, refetch } = useQuery<SupergraphData>(GET_SUPERGRAPH_DATA)
  const [createProduct] = useMutation(CREATE_PRODUCT)
  const [createReview] = useMutation(CREATE_REVIEW)

  const [newProductName, setNewProductName] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [reviewBody, setReviewBody] = useState<{ [key: string]: string }>({})

  if (loading) return <p>Carregando dados do Supergraph...</p>
  if (error) return <p>Erro: {error.message}</p>

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    await createProduct({
      variables: { name: newProductName, price: parseFloat(newProductPrice) }
    })
    setNewProductName('')
    setNewProductPrice('')
    refetch()
  }

  const handleCreateReview = async (productId: string) => {
    const body = reviewBody[productId]
    if (!body) return
    
    await createReview({
      variables: { productId, authorId: data?.me.id, body }
    })
    setReviewBody({ ...reviewBody, [productId]: '' })
    refetch()
  }

  return (
    <>
      <h1>E-commerce Supergraph Host</h1>
      
      <div className="card">
        <h2>Usuário Logado (Users DB)</h2>
        <p>Logado como: <strong>{data?.me?.username}</strong></p>
      </div>

      <div className="card">
        <h2>Adicionar Produto (Catalog DB)</h2>
        <form onSubmit={handleCreateProduct} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input placeholder="Nome do produto" value={newProductName} onChange={e => setNewProductName(e.target.value)} required />
          <input type="number" placeholder="Preço" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} required />
          <button type="submit">Adicionar</button>
        </form>

        <h2>Catálogo de Produtos</h2>
        <ul>
          {data?.products?.map((product: Product) => (
            <li key={product.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <h3>{product.name} - R$ {product.price.toFixed(2)}</h3>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input 
                  placeholder="Escrever avaliação..." 
                  value={reviewBody[product.id] || ''} 
                  onChange={e => setReviewBody({ ...reviewBody, [product.id]: e.target.value })}
                />
                <button onClick={() => handleCreateReview(product.id)}>Enviar (Reviews DB)</button>
              </div>

              {product.reviews && product.reviews.length > 0 && (
                <div style={{ paddingLeft: '20px', fontStyle: 'italic', color: '#666', marginTop: '10px' }}>
                  <h4>Avaliações:</h4>
                  {product.reviews.map((review: Review) => (
                    <p key={review.id}>
                      "{review.body}" — <strong>{review.author?.username || 'Desconhecido'}</strong>
                    </p>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App

