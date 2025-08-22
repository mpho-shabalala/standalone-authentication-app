import React, { type JSX } from 'react'
import { useAuth } from '../context/authContext'
import { Navigate } from 'react-router-dom';



 function PrivateRoute({children}: {children: JSX.Element})  : JSX.Element {
    const {isAuthenticated} = useAuth();

    if(!isAuthenticated){
        return <Navigate to='/login' />
    }
  return children;
}

export default PrivateRoute;
