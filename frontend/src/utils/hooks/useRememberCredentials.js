import { useEffect } from "react";

export const useRememberCredentials = (setEmail, setPassword, setRemember) => {
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);
};
