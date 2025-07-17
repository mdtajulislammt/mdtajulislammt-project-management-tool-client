import React from 'react';

const DeleteConfirmModal: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Delete Confirmation</h2>
      <p>Are you sure you want to delete this item?</p>
      <div className="mt-4 flex gap-2">
        <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        <button className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
