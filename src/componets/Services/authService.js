import { useNavigate } from "react-router";
import axiosInstance from "../../Axios/axios";
import { jwtDecode as jwt_decode } from 'jwt-decode';




const setToken = (token)=>{
    console.log("Here is my token to set :",token)
    localStorage.setItem('token',token);
    return token
}
const getToken = ()=>{
    const token = localStorage.getItem('token');
    if(token){
        return token;
    }
    return null
}

const login=(credentials)=>{
    return axiosInstance.post(`${process.env.REACT_APP_SIGIN}`,credentials)
}

const getUserEmail = ()=>{
    const token = getToken();
    if(token){
        const payLoad = jwt_decode(token);
        return payLoad?.email; 
    }
    return null
}
const getUserRole = () => {
    console.log('getUserRole function called');
    const token = getToken();
    console.log('Token:', token);

    if (token) {
        try {
            const payLoad = jwt_decode(token);
            console.log('Decoded Token Payload:', payLoad);
            const authorities = payLoad?.authorities;
            console.log('User Authorities:', authorities);
            return authorities;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    return null;
}




const isLoggedIn = ()=>{
    const token = getToken();
    if(token){
        const payLoad = jwt_decode(token);
        const isLogin  = Date.now() < payLoad.exp * 1000;
        return isLogin
    }
    return false
}

const logOut = () => {
  localStorage.clear();
}



export  default{getToken,setToken,login,getUserEmail,getUserRole,isLoggedIn,logOut}