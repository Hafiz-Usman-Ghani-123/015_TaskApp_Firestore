// Import the functions you need from the SDKs you need
import {
  db,
  doc,
  auth,
  setDoc,
  getAuth,
  getFirestore,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "./firebase.js";

// Toast function
async function toast(msg) {
  await Toastify({
    text: msg,
    className: "info",
    position: "center",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

// auth state ============================================================
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     location.href = "index.html"; // Redirection on successful login
//   } else {
//     location.href = "form-firebase.html"; // Redirect on sign out
//   }
// });

// Signup ============================================================
let userId = "";
const s_email = document.querySelector("#s_email");
const s_pass = document.querySelector("#s_pass");
const sForm = document.querySelector("#signup");

// Ensure form exists before adding event listener
if (sForm) {
  sForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    createUserWithEmailAndPassword(auth, s_email.value, s_pass.value)
      .then((userCredential) => {
        const user = userCredential.user;
        userId = user.uid;

        // Store user details in Firestore
        setDoc(doc(db, "users", user.uid), {
          email: s_email.value,
          password: s_pass.value,
        })
          .then(() => {
            toast("Account Has Been Created");
            sForm.reset();
          })
          .catch((error) => {
            toast("Error creating document: " + error.message);
          });
      })
      .catch((error) => {
        toast(error.message);
        sForm.reset();
      });
  });
}

// Login form code =======================================================
const l_email = document.querySelector("#l_email");
const l_pass = document.querySelector("#l_pass");
const lForm = document.querySelector("#login");

// Ensure form exists before adding event listener
if (lForm) {
  lForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    signInWithEmailAndPassword(auth, l_email.value, l_pass.value)
      .then((userCredential) => {
        const user = userCredential.user;
        toast("Login successful");
        location.href = "index.html"; // Redirect after successful login
      })
      .catch((error) => {
        toast(error.message);
      });
  });
}

// Export
export { toast, userId };
