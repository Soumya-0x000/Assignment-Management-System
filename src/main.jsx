import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import LandingPage from './components/landingPage/LandingPage.jsx'
import AdminDashboard from './components/adminDashboard/AdminDashboard.jsx'
import { KindeProvider } from '@kinde-oss/kinde-auth-react'

// const router = createBrowserRouter([
//   {
//       path: "/",
//       element: <LandingPage/>,
//   },
//   {
//       path: "/admindashboard",
//       element: <AdminDashboard/>
//   }
// ]);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="" element={<LandingPage />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
        </Route>
    )
  );

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* <KindeProvider
        clientId="c303e7226e8f453184b5edbdeead0de0"
        domain="https://assignmentmanagement.kinde.com"
        redirectUri="http://localhost:5173"
        logoutUri="http://localhost:5173"> */}
            <NextUIProvider>
                <RouterProvider router={router}/>
            </NextUIProvider>  
        {/* </KindeProvider> */}
    </React.StrictMode>,
)
