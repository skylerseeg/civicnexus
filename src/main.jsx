import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CivicNexusOS from './CivicNexusOS.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CivicNexusOS />
  </StrictMode>,
)
