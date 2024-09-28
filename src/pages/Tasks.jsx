import React, { useState, useEffect } from 'react';
import { Button, TextInput, Label, Modal } from 'flowbite-react';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import axios from 'axios';
import { BASE_URL } from '../App';
import { Datepicker } from 'flowbite-react';
import { HiOutlineExclamationCircle ,HiInformationCircle,HiMenu} from "react-icons/hi";
import { Avatar } from 'flowbite-react';
import Profile from '../components/Profile';
import Users from '../components/Users';

const Tasks = ({handleUserAuth}) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: new Date() });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusModalopen,setStatusModalOpen]=useState(false);
  const [status,setStatus]=useState(null)
  const [showDescription,setShowDescription]=useState(false);
  const [showTaskDetails,setShowTaskDetails]=useState("");
  const [showProfile,setProfile]=useState(false);
  const [showUsers,setShowUsers]=useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);





  const handleProfile=(value)=>{
    setProfile(value)
  }

  const handleUsers=(value)=>{
    setShowUsers(value)
  }
  const fetchTasks = async (url=`${BASE_URL}/tasks`) => {
    try {
      const response = await axios.get(url, { headers: { Authorization: `Token ${user.token}` } });
      setTasks(response.data.results);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async () => {
    try {
      await axios.post(
        `${BASE_URL}/tasks`,
        { 
          title: newTask.title, 
          description: newTask.description, 
          due_date:  formatDateToString(newTask.due_date)
        },
        { headers: { Authorization: `Token ${user.token}` } }
      );
      fetchTasks();
      setModalOpen(false);
      setNewTask({ title: '', description: '', due_date: new Date() });
    } catch (error) {
      console.error('Error creating task:', error.response.data);
    }
  };

  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

  const handleEditTask = async () => {
  
    try {
      await axios.put(
        `${BASE_URL}/tasks/${currentTaskId}`,
        { 
          title: newTask.title, 
          description: newTask.description, 
          due_date: formatDateToString(newTask.due_date)

        },
        { headers: { Authorization: `Token ${user.token}` } }
      );
      fetchTasks();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error editing task:', error);
    }finally{
      setNewTask({ title: '', description: '', due_date: new Date() });

    }
  };
console.log(newTask)
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEdit = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
    });
    console.log(task.due_date)
    setCurrentTaskId(task.id);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`, { headers: { Authorization: `Token ${user.token}` } });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCheckboxChange = (id, status) => {
    setCurrentTaskId(id)
    setStatusModalOpen(true)
    setStatus(status)
  };


  const updateStatus=async()=>{
    try{
    await axios.put(
      `${BASE_URL}/tasks/${currentTaskId}`,
      { 
       status:status
      },
      { headers: { Authorization: `Token ${user.token}` } }
    );
    fetchTasks();
    
  } catch (error) {
    console.error('Error editing task:', error.response.data);
  }finally{
    setStatus(null);
    setStatusModalOpen(false);
  }
  }

  const handleShowTaskDetails = (task) => {
  setShowTaskDetails(task);
  setShowDescription(true)
  };

  const sortTasks = (key) => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (key === 'due_date') {
        console.log("sorting")
        const dateA = new Date(a.due_date.split(' ')[0].split('-').reverse().join('-'));
        const dateB = new Date(b.due_date.split(' ')[0].split('-').reverse().join('-'));
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
  
      if (key === 'status') {
        return sortOrder === 'asc' ? a.status - b.status : b.status - a.status;
      }
  
      return 0;
    });
    
    setTasks(sortedTasks);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  
 const filteredTasks = tasks.filter(task => 
  task.title.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="h-screen  p-4 bg-gradient-to-r from-blue-200 to-purple-200">
      <div className="max-w-4xl mx-auto">
        <div className='flex justify-between items-center'>
        <Button color="light" onClick={() => setModalOpen(true)} className="mb-4 text-white bg-green-600 hover:bg-green-700 transition-colors duration-300">
          <HiPlus className="text-white mr-2 mt-1" /> Add Task
        </Button>
        <Users showUser={showUsers} handleShowUser={handleUsers}/>
        {user?.is_staff&& <Button color="" onClick={() => setShowUsers(true)} className="text-white mb-4  bg-orange-600 hover:bg-orange-700 transition-colors duration-300 grid ">
          <HiMenu className="text-white mr-2 mt-1  " />User List 
        </Button>}

        <Avatar placeholderInitials={user?.first_name[0]+user?.last_name[0]} rounded={true} onClick={()=>setProfile(true)} />
        <Profile profile={showProfile} handleProfile={handleProfile} handleUserAuth={handleUserAuth}/>
        </div>

        {/* to create task modal */}
        <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
          <Modal.Header>Create New Task</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="title" value="Task Title" />
                <TextInput 
                  id="title" 
                  type="text" 
                  placeholder="Enter task title" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
                  className="border-gray-400" 
                />
              </div>
              <div>
                <Label htmlFor="description" value="Task Description" />
                <TextInput 
                  id="description" 
                  type="text" 
                  placeholder="Enter task description" 
                  value={newTask.description} 
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
                  className="border-gray-400" 
                />
              </div>
              <div>
                <Label htmlFor="due_date" value="Due Date" />
                <Datepicker
                  selected={newTask.due_date} 
                  onSelectedDateChanged={(date) => { 
                    setNewTask({ ...newTask, due_date: date }); 
                  }} 
                
                  dateFormat="yyyy-MM-dd" 
                  className="w-full p-2 border border-gray-300 rounded-md" 
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="light" onClick={() => setModalOpen(false)} className="text-gray-700">
              Cancel
            </Button>
            <Button color="blue" onClick={handleCreateTask} className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
              Create Task
            </Button>
          </Modal.Footer>
        </Modal>

        {/* to edit task modal */}
        <Modal show={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <Modal.Header>Edit Task</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="title" value="Task Title" />
                <TextInput 
                  id="title" 
                  type="text" 
                  placeholder="Enter task title" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
                  className="border-gray-400" 
                />
              </div>
              <div>
                <Label htmlFor="description" value="Task Description" />
                <TextInput 
                  id="description" 
                  type="text" 
                  placeholder="Enter task description" 
                  value={newTask.description} 
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
                  className="border-gray-400" 
                />
              </div>
              <div>
                <Label htmlFor="due_date" value="Due Date" />
                <Datepicker
                  selected={newTask.due_date} 
                  onSelectedDateChanged={(date) => { 
                    setNewTask({ ...newTask, due_date: date }); 
                  }} 
                
                  dateFormat="yyyy-MM-dd" 
                  className="w-full p-2 border border-gray-300 rounded-md" 
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="light" onClick={() => setEditModalOpen(false)} className="text-gray-700">
              Cancel
            </Button>
            <Button color="blue" onClick={handleEditTask} className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
              Update Task
            </Button>
          </Modal.Footer>
        </Modal>


                {/* to update status modal */}
      <Modal show={statusModalopen} size="md" onClose={() => setStatusModalOpen(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {status ? "Completd task?": "Change status to pending?"}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() =>updateStatus()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={
                () => {setStatusModalOpen(false);
               setStatus(null);
    setStatusModalOpen(false);}}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
                {/* to show task description modal */}
      <Modal show={showDescription} onClose={() => setShowDescription(false)}>
        <Modal.Header>{showTaskDetails.title}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {showTaskDetails.description}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDescription(false)}>Close</Button>
        
        </Modal.Footer>
      </Modal>

        
 <TextInput 
          id="search" 
          type="text" 
          placeholder="Search tasks by title..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="mb-4 w-full border-gray-400" 
        />
        <div className="w-full flex justify-end gap-2 m-2">
          {previousPage && (
            <Button color="grey" onClick={() => fetchTasks(previousPage)}>
              Previous
            </Button>
          )}
          {nextPage && (
            <Button color="grey" onClick={() => fetchTasks(nextPage)}>
              Next
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr>
                <th className="p-4 cursor-pointer" onClick={() => sortTasks('status')}>
                  Status
                </th>
                <th className="p-4 cursor-pointer" onClick={() => sortTasks('due_date')}>
                  Due Date
                </th>
                <th className="p-4">Task Title</th>
               
                <th className="p-4">Actions</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-100">
                  <td className="p-4 flex justify-center items-center">
                    <input 
                      type="checkbox" 
                      checked={task.status} 
                      onChange={() => handleCheckboxChange(task.id, !task.status)} 
                    />
                  </td>
                  <td className="p-4 text-center">{ task.due_date.split(" ")[0]}</td>
                  <td className="p-4 text-center">{task.title}</td>
              
                  <td className="p-4 flex space-x-2 justify-center items-center">
                  <Button  onClick={() => handleShowTaskDetails(task)}  color="light">
                    <HiInformationCircle className="text-blue-700" />
                    </Button>
                    <Button onClick={() => handleEdit(task)} color="light">
                      <HiPencil className="text-gray-700" />
                    </Button>
                    <Button onClick={() => handleDelete(task.id)} color="light">
                      <HiTrash className="text-red-700" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
