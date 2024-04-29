import React, { useState } from 'react';
import { FaFolderOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function EditRoom({ title,roomId,clickedItem}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formInputs, setFormInputs] = useState({
    selectedImage:"",
    roomLocation: '',
    capacity: 0,
    roomDescription: '',
  });

  const handleChanges = (e) => {
    setError(null);
    const { name, value } = e.target;
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      [name]: name === 'capacity' ? parseInt(value, 10) : value,
    }));
  };

  const handleChangesImage = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  const notify = (type, message) => {
    toast[type](message, { position: toast.POSITION.TOP_CENTER });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('roomLocation', formInputs.roomLocation);
      formData.append('capacity', formInputs.capacity);
      formData.append('roomDescription', formInputs.roomDescription);

      const response = await axios.put(`${process.env.REACT_APP_EDIT_ROOM}/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage(response.data);
      notify('success', 'Room updated successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(error.response.data);
      notify('error', 'Error updating room.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="new">
      <div className="newcontainer">
        <div className="bottom">
          <div className="left">
            <img src={selectedImage || 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'} alt="" />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="formInput">
                <label htmlFor="file">Image:<FaFolderOpen className="icon" /></label>
                <input
                  type="file"
                  id="file"
                  style={{ display: 'none' }}
                  name="file"
                  className="inputRoom"
                  onChange={handleChangesImage}
                />
              </div>
              {Object.entries(formInputs).map(([key, value]) => (
                <div className="formInput" key={key}>
                  <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
                  <input
                    type={key === 'capacity' ? 'number' : 'text'}
                    placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                    name={key}
                    className="inputRoom"
                    onChange={handleChanges}
                    value={value}
                  />
                </div>
              ))}
              {successMessage && <div className="success-message">{successMessage}</div>}
              {error && <div className="error-message">{error}</div>}
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRoom;
