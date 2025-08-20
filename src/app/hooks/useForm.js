import { useState, useCallback } from 'react';

export const useForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.includes('[') && name.includes(']')) {
      // Handle array fields like examResults and installmentDetails
      const matches = name.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
      if (matches) {
        const [, arrayName, index, field] = matches;
        setFormData(prev => {
          const newArray = [...prev[arrayName]];
          newArray[index] = {
            ...newArray[index],
            [field]: type === 'checkbox' ? checked : value
          };
          return {
            ...prev,
            [arrayName]: newArray
          };
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  }, []);

  const setFieldValue = useCallback((name, value) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  return {
    formData,
    setFormData,
    handleChange,
    setFieldValue,
    resetForm
  };
};