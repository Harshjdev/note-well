import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/cards/EmptyCard/EmptyCard';
import AddNotesImg from '../../assets/images/add-note.svg';

function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);

  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAllNotes();
    getUserInfo();

  }, []);

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type: type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
      type: "",
    });
  };

  const closeAddEditModal = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // Delete note
  const deleteNote = async (data) => {
    const noteId = data._id;
    const accessToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (response.status === 200) {
        showToastMessage("Note Deleted Successfully", "success");
        // Update the state to remove the deleted note
        setAllNotes(prevNotes => {
          const updatedNotes = prevNotes.filter(note => note._id !== noteId);
          return updatedNotes;
        });
      } else {
        showToastMessage("Failed to delete note", "error");
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // Search
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { title: query }, // Modify to send 'title' instead of 'query'
      });
  
      if (response.data && response.data.data) { // Check for 'data' field instead of 'notes'
        setIsSearch(true);
        setAllNotes(response.data.data); // Set notes from 'data' field
      } else {
        setIsSearch(false);
        setAllNotes([]);
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };



  




  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} />
      <div className='container mx-auto'>
        {allNotes.length > 0 ? (
          <div className='grid grid-cols-3 gap-4 mt-8'>
            {allNotes.map((item, index) => (
             <NoteCard
             key={item._id}
             title={item.title}
             date={moment(item.createdON).format('MMM DD, YYYY')}
             content={item.content}
             tags={item.tags} // Change from 'tag' to 'tags'
             onEdit={() => handleEdit(item)}
             onDelete={() => deleteNote(item)}
           />
            ))}
          </div>
        ) : (
          <EmptyCard imgSrc={AddNotesImg} data={`Start creating your first note! Click the 'Add' button to join thoughts, ideas and reminders. Let's get started! `} />
        )}
      </div>

      <button
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeAddEditModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] bg-white rounded-md mx-auto mt-5 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={closeAddEditModal}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default Home;
