// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = Cookies.get('user'); // Get user info from cookie
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            // Optionally redirect if already logged in
            // navigate('/');
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        Cookies.set('user', JSON.stringify(userData), { secure: true, sameSite: 'strict' }); // Set cookie
        navigate('/'); // Redirect to your main app route after login
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('user'); // Remove cookie
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;