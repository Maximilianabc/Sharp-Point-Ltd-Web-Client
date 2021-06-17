import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import {
  logoutAction,
  postRequest,
  UserState
} from "../Util";

const LogOut = () => {
  const token = useSelector((state: UserState) => state.token);
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const data = {
      sessionToken: token
    };
    postRequest('/accessRight/userLogout', data);
    dispatch(logoutAction());
    history.push({ 
      pathname: '/',
      state: location.state ?? ''
    });
  }, [])
  return null;
};

export {
 LogOut 
}
