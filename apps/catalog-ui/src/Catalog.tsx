import React, { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'

const GET_PRODUCTS = gql`
  query GetProducts {
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
  products: Product[]
}

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

// Criação do Client isolado para o Micro-frontend
const catalogClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/' }),
  cache: new InMemoryCache(),
})

export default function CatalogRemoteWrapper({ currentUser }: { currentUser: { id: string } }) {
  return (
    <ApolloProvider client={catalogClient}>
      <Catalog currentUser={currentUser} />
    </ApolloProvider>
  )
}

function Catalog({ currentUser }: { currentUser: { id: string } }) {
  const { loading, error, data, refetch } = useQuery<SupergraphData>(GET_PRODUCTS)
  const [createProduct] = useMutation(CREATE_PRODUCT)
  const [createReview] = useMutation(CREATE_REVIEW)

  const [newProductName, setNewProductName] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [reviewBody, setReviewBody] = useState<{ [key: string]: string }>({})

  if (loading) return <p>Carregando produtos no MFE...</p>
  if (error) return <p>Erro no MFE: {error.message}</p>

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
      variables: { productId, authorId: currentUser.id, body }
    })
    setReviewBody({ ...reviewBody, [productId]: '' })
    refetch()
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #646cff', borderRadius: '8px', marginTop: '20px' }}>
      <h2 style={{ color: 'red' }}>📦 MFE Remoto: Catálogo</h2>
      
      <form onSubmit={handleCreateProduct} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Nome do produto" value={newProductName} onChange={e => setNewProductName(e.target.value)} required />
        <input type="number" placeholder="Preço" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} required />
        <button type="submit">Adicionar Produto</button>
      </form>

      <ul>
        {data?.products?.map((product: Product) => (
          <li key={product.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px', listStyle: 'none' }}>
            <h3>{product.name} - R$ {product.price.toFixed(2)}</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input 
                placeholder="Escrever avaliação..." 
                value={reviewBody[product.id] || ''} 
                onChange={e => setReviewBody({ ...reviewBody, [product.id]: e.target.value })}
              />
              <button onClick={() => handleCreateReview(product.id)}>Enviar Review</button>
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
  )
}

