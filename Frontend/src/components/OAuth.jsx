import { Button } from "flowbite-react";
import { FaGoogle } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { googleSignIn } from "../apis/auth";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      // const res = await fetch("/api/auth/users/google", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     name: result.user.displayName,
      //     email: result.user.email,
      //     googlePhotoUrl: result.user.photoUrl,
      //   }),
      // });

      // const data = await res.json();
      // if (res.ok) {
      //   dispatch(signInSuccess(data));
      //   setTimeout(() => {
      //     navigate("/");
      //   }, 3000);
      // }
      const { ok, data } = await googleSignIn(result);
      if (!ok) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      // console.log("ERROR: " + error);
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
