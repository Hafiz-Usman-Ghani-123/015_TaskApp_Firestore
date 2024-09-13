// Import the functions you need from the SDKs you need
import {
  db,
  doc,
  auth,
  setDoc,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "./firebase.js";

// aik function ban diya hy ab toast use krty rhoooo
function toast(msg) {
  Toastify({
    text: msg,
    className: "info",
    position: "center", // `left`, `center` or `right`
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

// auth state ============================================================

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     location.href = "index.html";
//   }
// });

// signup============================================================

let userId = "";
const s_email = document.querySelector("#s_email");
const s_pass = document.querySelector("#s_pass");
const sForm = document.querySelector("#signin");
// function which  exicute on click
sForm.addEventListener("submit", createAccount);
function createAccount(ev) {
  ev.preventDefault();
  createUserWithEmailAndPassword(auth, s_email.value, s_pass.value)
    .then((userCredential) => {
      const user = userCredential.user;
      userId = user.uid;
      setDoc(doc(db, "users", user.uid), {
        email: s_email.value,
        password: s_pass.value,
      });
      toast("Account Has Been Created");
      sForm.reset();
    })
    .catch((error) => {
      const errorMessage = error.message;
      toast(errorMessage);
    });
}

// login form code======================================================

const l_email = document.querySelector("#l_email");
const l_pass = document.querySelector("#l_pass");
const lForm = document.querySelector("#login");
lForm.addEventListener("submit", loginAccount);
async function loginAccount(ev) {
  ev.preventDefault();
  signInWithEmailAndPassword(auth, l_email.value, l_pass.value)
    .then((userCredential) => {
      var user = userCredential.user;
      // toast("Login successful");
      location.href = "index.html";
    })
    .catch((error) => {
      const errorMessage = error.message;
      toast(errorMessage);
    });
}
// export
export { toast, userId };
