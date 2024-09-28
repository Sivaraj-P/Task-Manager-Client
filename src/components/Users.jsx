import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'flowbite-react';
import axios from 'axios';
import { BASE_URL } from '../App';

const Users = ({ showUser, handleShowUser }) => {
  const [users, setUsers] = useState([]);
  const loggeduser= JSON.parse(localStorage.getItem('user'));

  const fetchUserList=async()=>{
    try{
        const response = await axios.get(`${BASE_URL}/users`, { headers: { Authorization: `Token ${loggeduser.token}` } });
        setUsers(response.data);
    }catch(err){
        console.log(err)
    }
  }
  useEffect(() => {
    if (showUser) {
    fetchUserList()
    }
  }, [showUser]);

  return (
    <>
      
      <Modal show={showUser} onClose={() => handleShowUser(false)} size="xl">
        <Modal.Header>Users List</Modal.Header>
        <Modal.Body>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>First Name</Table.HeadCell>
              <Table.HeadCell>Last Name</Table.HeadCell>
              <Table.HeadCell>Phone Number</Table.HeadCell>
              <Table.HeadCell>Last Login</Table.HeadCell>
              <Table.HeadCell>Staff</Table.HeadCell>
              <Table.HeadCell>Task Count</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{user.first_name}</Table.Cell>
                    <Table.Cell>{user.last_name}</Table.Cell>
                    <Table.Cell>{user.phone_number}</Table.Cell>
                    <Table.Cell>{user.last_login}</Table.Cell>
                    <Table.Cell>{user.is_staff ? 'Yes' : 'No'}</Table.Cell>
                    <Table.Cell>{user.task_count}</Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan="6" className="text-center">
                    No users available
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button color="light" onClick={() => handleShowUser(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Users;
