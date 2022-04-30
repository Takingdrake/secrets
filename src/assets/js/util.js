import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider, sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup, signOut
} from "firebase/auth";
import {auth, db} from "../../firebase/firebase";
import {child, get, ref} from "firebase/database";
import store from "../../state/store"
import {loadSecrets, addUID} from "../../state/secretSlice";

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;

        store.dispatch(addUID(user.uid))

        get(child(ref(db), user.uid + '/secrets')).then((snapshot) => {
            if (snapshot.exists()) {
                store.dispatch(loadSecrets(snapshot.val()))
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

export {logout, signInWithGoogle}