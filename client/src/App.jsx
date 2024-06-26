import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import GameItem from './components/GameItem'
import GamePage from './pages/GamePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import { setContext } from '@apollo/client/link/context'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  // possible states include: about, portfolio, resume, contact
  const [selectedPage, setSelectedPage] = useState('gamepage')

  function getPage(state) {
    // console.log(state)
    switch (state) {
      case 'gamepage':
        return <GamePage />
      case 'profilepage':
        return <ProfilePage />
      case 'loginpage':
        return <LoginPage />
      default:
        console.log(state);
        return <GamePage />
    }
  }

  // console.log("render")
  return (
    <ApolloProvider client={client}>
      <>
        <Header selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

        {/* page to show */}
        <div className='content-wrapper'>{getPage(selectedPage)}</div>

        <Footer />

      </>
    </ApolloProvider>
  )
}

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App
