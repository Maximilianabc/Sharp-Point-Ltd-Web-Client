import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { logoutAction, postRequest, SessionToken, State } from "../Util";

const LogOut = () => {
  const token = useSelector((state: State<SessionToken>) => state.token);
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
