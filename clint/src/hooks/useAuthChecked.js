import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLogedIn } from "../features/auth/authSlice";

const useAuthChecked = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const localAuth = localStorage?.getItem("auth");

    if (localAuth) {
      const auth = JSON.parse(localAuth);

      if (auth?.accessToken && auth?.user) {
        dispatch(userLogedIn({ accessToken: auth.accessToken, user: auth.user }));
      }
    }
    setAuthChecked(true);
  }, [dispatch]);
  return authChecked;
};

export default useAuthChecked;
