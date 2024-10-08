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

// aik function ban diya hy ab 'toast' use krty rhoooo
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
const sForm = document.querySelector("#signup");
console.log(sForm);
// function which  exicute on submit
sForm.addEventListener("submit", (ev) => {
  // function createAccount(ev) {
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
      sForm.reset();
      toast(errorMessage);
    });
});

console.log(userId);

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
      // location.href = "index.html";
    })
    .catch((error) => {
      const errorMessage = error.message;
      toast(errorMessage);
    });
}
// export
export { toast, userId };
// ----------------------------------------------------  app.js code --------------------------------
// Import the functions you need from the SDKs you need
import { auth, db, onAuthStateChanged, signOut } from "./firebase.js";
import { toast, userId } from "./forms.js";

// log out code====================

// const logoutbtn = document.querySelector(".logout");
// logoutbtn.addEventListener("click", logoutAccount);
// async function logoutAccount() {
//   try {
//     await signOut(auth);
//     toast("Sign-out successful.");
//   } catch (error) {
//     toast("Error signing out: " + error.message);
//   }
// }

// onAuthStateChanged(auth, (user) => {
//   if (!user) {
//     toast("User is signed out");
//     location.href = "form-firebase.html";
//   } else {
//     // toast(user.uid)
//   }
// });


// Reference to HTML elements
const taskinput = document.getElementById("taskinput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const loader = document.getElementById("loader");

// Function to show loader
function showLoader() {
  loader.style.display = "flex"; // Show loader
}
// Function to hide loader
function hideLoader() {
  loader.style.display = "none"; // Hide loader
}
// Add task button
addBtn.addEventListener("click", addtodo);

async function addtodo() {
  const task = taskinput.value.trim();
  if (task) {
    showLoader(); // Show loader when task is being added
    try {
      // const docRef = await addDoc(collection(db, "Tasks"), {
      const docRef = await setDoc(doc(db, "users", user.uid), {
        task: task,
        createdAt: new Date().toDateString(), // Add current timestamp
        createdBy: userId, // Current user ID
      });
      taskinput.value = ""; // Clear input field
      loadTasks(); // Reload tasks
    } catch (e) {
      toast("Error adding document: " + e.message);
    } finally {
      hideLoader(); // Hide loader after operation
    }
  } else {
    toast("Please enter a task.");
  }
}

async function loadTasks() {
  showLoader(); // Show loader when tasks are being loaded
  taskList.innerHTML = ""; // Clear current list

  const taskCollection = collection(db, "task");
  const taskQuery = query(taskCollection, orderBy("createdAt", "asc"), ); // Query to order by createdAt

  try {
    const taskSnapshot = await getDocs(taskQuery); // Use the ordered query

    if (taskSnapshot.empty) {
      taskList.textContent = "No tasks found."; // Handle empty state
    } else {
      taskSnapshot.forEach((doc) => {
        const li = document.createElement("li");
        li.textContent = doc.data().task; // Assuming 'task' is the field name

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = " x ";
        deleteBtn.addEventListener("click", async () => {
          showLoader(); // Show loader when task is being deleted
          try {
            await deleteDoc(doc.ref); // Use `doc.ref` to reference the document
            loadTasks(); // Reload tasks after deletion
          } catch (e) {
            console.error("Error deleting document: ", e); // Log error for debugging
            alert("Error deleting document: " + e.message);
          } finally {
            hideLoader(); // Hide loader after operation
          }
        });

        li.appendChild(deleteBtn); // Append delete button to each task
        taskList.appendChild(li); // Append task to task list
      });
    }
  } catch (e) {
    console.error("Error loading tasks: ", e); // Log error for debugging
    alert("Error loading tasks: " + e.message);
  } finally {
    hideLoader(); // Hide loader after loading is done
  }
}

// Load tasks on page load
window.onload = function () {
  loadTasks(); // Load tasks on page load
};
