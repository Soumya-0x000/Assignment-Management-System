import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';

const App = () => {
    const router = createBrowserRouter([
        {
          path: "/",
          element: <LandingPage/>,
        },
    ]);
    return (
        <div>
            <RouterProvider router={router}/>
        </div>
    )
}

export default App;
