# Nexus Graph 

Hey there! Thanks for checking out my project. This is **Nexus Graph**, a full-stack web application designed and built for the SRM Full Stack Engineering Challenge.

I built this app to process raw string inputs of node connections (like `A->B`) and map them out into perfectly structured JSON graphs. It recursively maps out root nodes, figures out exactly how deep each tree gets, and cleanly identifies any disconnected cyclical loops in the data without crashing.

## 🚀 Live Demo

You can try out the live web app and API currently deployed on Vercel:

- **Frontend Application:**  [https://frontend-taupe-phi-89.vercel.app](https://frontend-taupe-phi-89.vercel.app)
- **Backend API Base:** [https://backend-topaz-six-73.vercel.app](https://backend-topaz-six-73.vercel.app) (Handles `POST /bfhl`)

## 🛠️ Tech Stack

I divided the architecture completely symmetrically to keep the concerns separated:

*   **Frontend:** React built with Vite. I wanted the UI to look incredibly sleek, so I completely custom-built a **Midnight Black and Emerald Green** glowing interface using glassmorphism concepts and pure CSS (no bloated UI libraries).
*   **Backend:** Node.js with Express! The core of the backend is a custom Depth-First Search (DFS) algorithm that traces the node pathways dynamically on the fly. 

## 💻 Running It Locally

If you want to pull this down and test it on your own machine, it's super easy to get running.

**1. Clone the repo:**
```bash
git clone https://github.com/RahulNegi7/Bajaj_finservFSD.git
cd Bajaj_finservFSD
```

**2. Start the Backend:**
```bash
cd backend
npm install
node index.js
```
*(The API will fire up cleanly on localhost:3000)*

**3. Start the Frontend:**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*(The React UI will spin up on localhost:5173)*

## 🧠 Challenge Constraints Handled
- **Speed:** The graph DFS natively traces paths with an `O(V+E)` complexity. It churns through 50 nodes in millisecond boundaries, well inside the 3-second evaluation limit!
- **Edge cases:** Catches and isolates invalid node schema formats and drops duplicate edges intelligently to keep the mapping completely predictable.
- **Cycles:** Isolates and restricts depth measurements when loops are detected, wiping the cyclic `tree` sub-object clean so you don't jump into an infinite loop trying to render it!

Hope you enjoy analyzing some graphs! Let me know if you run into any wild cyclical loops testing it!
