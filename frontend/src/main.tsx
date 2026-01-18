import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import {SonnToaster} from "@/components/ui/sonner.tsx";
import App from './App.tsx'
import './assets/globals.css'
import {ThemeProvider} from "@/providers/theme-provider.tsx";


Amplify.configure({
    API: {
        GraphQL: {
            endpoint: import.meta.env.VITE_API_URL,
            region: import.meta.env.VITE_AWS_REGION,
            defaultAuthMode: 'apiKey',
            apiKey: import.meta.env.VITE_API_KEY
        }
    }
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <BrowserRouter>
                <App />
                <SonnToaster />
            </BrowserRouter>`
        </ThemeProvider>
    </StrictMode>,
)