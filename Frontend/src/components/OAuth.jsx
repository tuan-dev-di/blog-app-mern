//? ---------------| IMPORT LIBRARIES |---------------
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

//? ---------------| IMPORT GOOGLE SERVICES |---------------
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

//? ---------------| IMPORT COMPONENTS |---------------
import { Button } from "flowbite-react";
import { FaGoogle } from "react-icons/fa";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { GOOGLE_AUTH } from "../apis/auth";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //? ---------------| HANDLE USING GOOGLE AUTHENTICATION |---------------
  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const { email, displayName, photoURL } = result.user;
      const { ok, data } = await GOOGLE_AUTH({
        email: email,
        name: displayName,
        photo: photoURL,
      });

      if (!ok) {
        dispatch(signInFailure(data));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/profile");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <Button
      outline
      gradientDuoTone="purpleToPink"
      type="button"
      onClick={handleGoogle}
    >
      Continue with Google
      <FaGoogle className="ml-2 h-5 w-5" />
    </Button>
  );
};

export default OAuth;
