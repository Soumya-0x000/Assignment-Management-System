import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './components/home/HomePage'

const App = () => {
    const router = createBrowserRouter([
        {
          path: "/",
          element: <HomePage/>,
        },
    ]);
    return (
        <div>
            <RouterProvider router={router}/>
        </div>
    )
}

export default App