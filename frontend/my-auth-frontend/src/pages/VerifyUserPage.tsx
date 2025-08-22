import React, { useState } from 'react'
import { getPendingVerificationEmail } from '../utils/localStorageUtils'
import { useLocation } from 'react-router-dom'


function VerifyUserPage() {
  const [email, setEmail] = useState(getPendingVerificationEmail())
//   const [token, setToken] = useState(useLocation('token'))
  return (
    <div>Verification information has been sent to this email : {email}</div>
  )
}

export default VerifyUserPage