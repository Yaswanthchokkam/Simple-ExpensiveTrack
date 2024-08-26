import { useContext } from "react";
import { UserContext } from "../Contexts/userContext";
import { Navigate } from "react-router-dom";

interface PrivateProps {
  Component: React.ComponentType;
}
export default function Private({ Component }: PrivateProps){
    const loggedData = useContext(UserContext);

  if (!loggedData) {
    return <Navigate to="/" />;
  }

  return loggedData.user !== null ? (
    <Component />
  ) : (
    <Navigate to="/" />
  );
}