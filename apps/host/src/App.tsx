import React, { Suspense } from 'react'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import './App.css'

// O Host agora carrega apenas os dados vitais para o Shell (ex: Usuário Logado)
const GET_ME = gql`
  query GetMe {
    me {
      id
      username
    }
  }
`

interface SupergraphData {
  me: { id: string; username: string }
}

// Importação assíncrona do Micro-frontend Remoto!
const CatalogRemote = React.lazy(() => import('catalog/Catalog'))

function App() {
  const { loading, error, data } = useQuery<SupergraphData>(GET_ME)

  if (loading) return <p>Carregando Shell (Host)...</p>
  if (error) return <p>Erro no Host: {error.message}</p>

  return (
    <>
      <h1>E-commerce Shell (Host)</h1>
      
      <div className="card" style={{ border: '2px solid #4CAF50' }}>
        <h2 style={{ color: '#4CAF50' }}>👤 Dados Locais (Host)</h2>
        <p>Logado como: <strong>{data?.me?.username}</strong></p>
      </div>

      <div style={{ marginTop: '40px' }}>
        {/* Aqui nós injetamos o Remote Component e o Suspense mostra o Fallback enquanto baixa da rede */}
        <Suspense fallback={<p style={{ color: '#646cff', fontStyle: 'italic' }}>⬇️ Baixando Catálogo do MFE Remoto (Porta 5174)...</p>}>
          <CatalogRemote currentUser={{ id: data?.me.id ?? '' }} />
        </Suspense>
      </div>
    </>
  )
}

export default App
