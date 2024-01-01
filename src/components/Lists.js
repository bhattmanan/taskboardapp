// Lists.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Lists = ({ userId }) => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/lists/${userId}`);
        setLists(response.data);
      } catch (error) {
        console.error('Error fetching lists:', error.response.data.error);
      }
    };

    fetchLists();
  }, [userId]);

  const handleCreateList = async () => {
    try {
      const response = await axios.post('http://localhost:3001/lists', {
        userId,
        listName: newListName,
      });
      console.log(response.data.message); // Handle successful list creation
      setNewListName('');
    } catch (error) {
      console.error('Error creating list:', error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Lists</h2>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>{list.list_name}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="New List Name"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
      />
      <button onClick={handleCreateList}>Create List</button>
    </div>
  );
};

export default Lists;
