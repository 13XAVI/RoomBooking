import { createContext, useContext } from "react";

const EmailContext = createContext();

export const useEmail = () => useContext(EmailContext);

export const EmailProvider = ({ children, email }) => (
  <EmailContext.Provider value={email}>{children}</EmailContext.Provider>
);
