import React, { createContext, useReducer, useEffect } from "react";

// Initial state for the authentication context
const initialState = {
  user: null,
  loading: true, // Start with loading as true
};

export const AuthContext = createContext(initialState);

// Reducer function to handle state updates
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        loading: false, // Set loading to false on successful login
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: false, // Set loading to false on logout
      };
    case "SET_LOADING_COMPLETE":
      return {
        ...state,
        loading: false, // Explicitly set loading to false after initial check
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // useEffect to handle initial authentication check from localStorage
  useEffect(() => {
    // A simple function to get user from local storage
    const getUserFromLocalStorage = () => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    };
    
    const storedUser = getUserFromLocalStorage();
    
    if (storedUser) {
      // If a user is found, set it in the state and dispatch LOGIN
      dispatch({ type: "LOGIN", payload: storedUser });
    } else {
      // If no user is found, simply set loading to false
      dispatch({ type: "SET_LOADING_COMPLETE" });
    }
  }, []);

  const login = (userData) => {
    // ... your login logic here ...
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch({ type: "LOGIN", payload: userData });
  };

  const logout = () => {
    // ... your logout logic here ...
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loading: state.loading }}>
      {children}
    </AuthContext.Provider>
  );
};
