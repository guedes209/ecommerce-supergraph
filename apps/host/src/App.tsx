import { useQuery } from '@apollo/client/react'
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
    }
  }
`

function App() {
  const { loading, error, data } = useQuery<any>(GET_SUPERGRAPH_DATA)

  if (loading) return <p>Carregando dados do Supergraph...</p>
  if (error) return <p>Erro: {error.message}</p>

  return (
    <>
      <h1>E-commerce Supergraph Host</h1>
      
      <div className="card">
        <h2>Usuário Logado (Subgraph: Users)</h2>
        <p>Logado como: <strong>{data?.me?.username}</strong></p>
      </div>

      <div className="card">
        <h2>Catálogo de Produtos (Subgraph: Catalog)</h2>
        <ul>
          {data?.products?.map((product: any) => (
            <li key={product.id}>
              {product.name} - R$ {product.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
