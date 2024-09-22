import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  collection,
  query,
  orderBy,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "./firebase.js";
import { toast, userId } from "./forms.js";

// Reference to HTML elements
const taskinput = document.getElementById("taskinput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const loader = document.getElementById("loader");

let currentUser = null; // Variable to hold current logged-in user

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
  if (task && currentUser) {
    // Ensure task is not empty and user is authenticated
    showLoader(); // Show loader when task is being added
    try {
      // Adding task for the current user
      await setDoc(doc(db, "tasks", `${currentUser.uid}_${task}`), {
        // Generate unique document ID for task
        task: task,
        createdAt: new Date().toISOString(), // Use ISO string for timestamp
        createdBy: currentUser.uid, // Reference the authenticated user ID
      });
      toast("Task added successfully.");
      taskinput.value = ""; // Clear input field
      loadTasks(); // Reload tasks
    } catch (e) {
      toast("Error adding document: " + e.message);
    } finally {
      hideLoader(); // Hide loader after operation
    }
  } else {
    toast("Please enter a task or login.");
  }
}

async function loadTasks() {
  if (!currentUser) {
    toast("User is not authenticated.");
    return;
  }

  showLoader(); // Show loader when tasks are being loaded
  taskList.innerHTML = ""; // Clear current list

  const taskCollection = collection(db, "tasks");
  const taskQuery = query(taskCollection, orderBy("createdAt", "asc")); // Query to order by createdAt

  try {
    const taskSnapshot = await getDocs(taskQuery); // Use the ordered query

    if (taskSnapshot.empty) {
      taskList.textContent = "No tasks found."; // Handle empty state
    } else {
      taskSnapshot.forEach((doc) => {
        const taskData = doc.data();
        if (taskData.createdBy === currentUser.uid) {
          // Only show tasks for the current user
          const li = document.createElement("li");
          li.textContent = taskData.task; // Assuming 'task' is the field name

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = " x ";
          deleteBtn.addEventListener("click", async () => {
            showLoader(); // Show loader when task is being deleted
            try {
              await deleteDoc(doc.ref); // Delete document by reference
              loadTasks(); // Reload tasks after deletion
              toast("Task deleted successfully.");
            } catch (e) {
              console.error("Error deleting document: ", e); // Log error for debugging
              alert("Error deleting document: " + e.message);
            } finally {
              hideLoader(); // Hide loader after operation
            }
          });

          li.appendChild(deleteBtn); // Append delete button to each task
          taskList.appendChild(li); // Append task to task list
        }
      });
    }
  } catch (e) {
    console.error("Error loading tasks: ", e); // Log error for debugging
    alert("Error loading tasks: " + e.message);
  } finally {
    hideLoader(); // Hide loader after loading is done
  }
}

// On page load, load tasks and set current user
window.onload = function () {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user; // Store current user information
      loadTasks(); // Load tasks for the authenticated user
    } else {
      toast("No user is signed in.");
      location.href = "form-firebase.html"; // Redirect to login page if not authenticated
    }
  });
};
