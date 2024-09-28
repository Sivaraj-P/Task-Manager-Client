import React from 'react'
import { Modal,Button } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
const Profile = ({profile,handleProfile,handleUserAuth}) => {
    const user= JSON.parse(localStorage.getItem('user'))
    const navigate=useNavigate();

    const logout=()=>{
        localStorage.removeItem('user');
        handleUserAuth("");
        navigate('/login')

    }
  return (
    <>
     <Modal show={profile} onClose={() => handleProfile(false)}>
        <Modal.Header>Profile Details</Modal.Header>
        <Modal.Body>
         {user &&(
             <div className="space-y-6">
             <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
             {/* <p><strong>Email:</strong> {profileData.email}</p> */}
             <p><strong>Phone:</strong> {user.phone_number}</p>
             <p><strong>Last Login:</strong> {user.last_login}</p>
           </div>
         )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="light" onClick={() => handleProfile(false)}>
            Close
          </Button>
          <Button color="red" className='bg-red-600 text-white' onClick={() => logout()}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  )
}

export default Profile