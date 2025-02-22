import axios from 'axios';
import React from 'react';

const axiosPublic = axios.create({
    baseURL: 'https://task-management-server-o7it.onrender.com'
})
const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;