import React, { useState, useEffect } from 'react';
import AdminBoard from '../../components/board/admin/AdminBoard';

const ListContainer = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('your_api_endpoint_here');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return <AdminBoard items={items} />;
};

export default ListContainer;