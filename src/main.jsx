import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App.jsx'
import './index.css'
import "./axios/global-intances.js"
import { persistor, store } from './redux/store.js'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <Toaster
      toastOptions={{
        style: {
          fontSize: "13px"
        }
      }}
    />
    </PersistGate>
  </Provider>
)
