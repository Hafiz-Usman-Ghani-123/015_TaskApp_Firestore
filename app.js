// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOKoSdvFmMvTqhLlWtuA7qca5k6GdWXgk",
  authDomain: "my-islamic-web-page.firebaseapp.com",
  projectId: "my-islamic-web-page",
  storageBucket: "my-islamic-web-page.appspot.com",
  messagingSenderId: "1050889788538",
  appId: "1:1050889788538:web:14cd46d4b2e5a65cb26fc3",
  measurementId: "G-KKHZT46XN2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Reference to HTML elements
const taskinput = document.getElementById("taskinput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const loader = document.getElementById("loader"); // Reference to loader element

// Function to show loader
function showLoader() {
  loader.style.display = "flex"; // Show loader
}

// Function to hide loader
function hideLoader() {
  loader.style.display = "none"; // Hide loader
}
// add doc btn
addBtn.addEventListener("click", async () => {
  const task = taskinput.value.trim();
  if (task) {
    showLoader(); // Show loader when task is being added
    try {
      const docRef = await addDoc(collection(db, "Tasks"), {
        task: task,
        createdAt: new Date(), // Add current timestamp
      });
      taskinput.value = ""; // Clear input field
      loadTasks(); // Reload tasks
    } catch (e) {
      console.error("Error adding document: ", e); // Log error for debugging
      alert("Error adding document: " + e.message);
    } finally {
      hideLoader(); // Hide loader after operation
    }
  }
});

async function loadTasks() {
  showLoader(); // Show loader when tasks are being loaded
  taskList.innerHTML = ""; // Clear current list

  const taskCollection = collection(db, "Tasks");
  const taskQuery = query(taskCollection, orderBy("createdAt", "asc")); // Query to order by createdAt

  try {
    const taskSnapshot = await getDocs(taskQuery); // Use the ordered query

    if (taskSnapshot.empty) {
      taskList.textContent = "No tasks found."; // Handle empty state
    }

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
  } catch (e) {
    console.error("Error loading tasks: ", e); // Log error for debugging
    alert("Error loading tasks: " + e.message);
  } finally {
    hideLoader(); // Hide loader after loading is done
  }
}
window.onload = function() {
  loadTasks(); // Load tasks on page load
  
}