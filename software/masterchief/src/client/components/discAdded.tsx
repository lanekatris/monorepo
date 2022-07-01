import { useForm } from 'react-hook-form';
import axios from 'axios';
import React from 'react';
import { ErrorMessage } from '@hookform/error-message';

export function DiscAdded() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/dg/disc-added`, data);
  };
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Brand"
        {...register('brand', { required: true, maxLength: 80 })}
      />
      <input
        type="text"
        placeholder="Model"
        {...register('model', { required: true, maxLength: 100 })}
      />
      <input type="text" placeholder="Date" {...register('date', {})} />

      <input type="submit" />
    </form>
  );
}
