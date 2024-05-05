import React, { useState } from 'react';
import TagInput from '../../Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from 'axios';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose,showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  //new note
  const addNewNote = async () => {
    const accessToken = localStorage.getItem("token"); // Get accessToken from localStorage
    try {
      const response = await axiosInstance.post("http://localhost:8000/add-note", {
        title,
        content,
        tags,
      }, {
        headers: {
          Authorization:`Bearer ${accessToken}`, // Use accessToken here
        }
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully")
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.error("Error adding note:", error);
      setError(error.message || "Failed to add note");
    }
  };

  //edit note
  const editNote = async () => {
    const noteId = noteData._id; 
    const accessToken = localStorage.getItem("token"); // Get accessToken from localStorage

    try {
      const response = await axiosInstance.put(`http://localhost:8000/edit-note/${noteId}`, {
        title,
        content,
        tags,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use accessToken here
        }
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully")
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.error("Error editing note:", error);
      setError(error.message || "Failed to edit note");
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError("");

    if (type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className='relative'>
      <button
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500 '
        onClick={onClose}
      >
        <MdClose className='text-xl text-slate-400' />
      </button>

      <div className='flex flex-col gap-2'>
        <label className='input-label'>Title</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='Go to Gym At 5'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Content'
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className='mt-3'>
        <label className='input-label'>TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
