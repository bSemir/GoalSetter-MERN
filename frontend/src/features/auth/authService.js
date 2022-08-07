import axios from 'axios'

const API_URL = '/api/users/';

//user gets passed in there
const register = async (userData) => {
    //data is in 'response' variable
    const response = await axios.post(API_URL, userData);

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data;
}
//login user
const login = async (userData) => {
    //data is in 'response' variable
    const response = await axios.post(API_URL + 'login', userData);

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data;
}

//logout
const logout = () => {
    localStorage.removeItem('user');
}

const authService = {
    register,
    login,
    logout
}

export default authService