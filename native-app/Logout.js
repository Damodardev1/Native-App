// // Logout.js

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import setAuthToken from './Headers'; // Import the Headers component

// const Logout = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token'); // Clear token from localStorage
//     setAuthToken(null); // Remove token from Axios headers
//     navigate('/'); // Redirect to login page
//   };

//   return (
//     <button onClick={handleLogout}>
//       Logout
//     </button>
//   );
// };

// export default Logout;
