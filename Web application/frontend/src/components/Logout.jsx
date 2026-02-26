import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const dispatch = useDispatch();

const handleLogout = async () => {
  await signOut(auth);
  dispatch(logout());
};
