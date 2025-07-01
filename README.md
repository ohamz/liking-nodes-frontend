# Interactive Graph Frontend

## Overview
This project is the frontend of an interactive graph-based application. It allows users to view, explore, and modify a network of nodes connected by edges. Each node displays an ID and a **like** counter, which influences the node’s size. The interface is designed for ease of use, with intuitive buttons to add new nodes and to “reload” or reset the graph’s layout.

**[Live Demo](https://liking-nodes.vercel.app/)**  
Check out the interactive graph in action!

## Features
1. **Dynamic Node Sizing**  
   - Each node has a like counter displayed on hover.  
   - Clicking on a node increments its likes.  
   - As likes increase, the node’s size grows. Once it hits a certain modulo, it resets to the original size (the likes remain stored, but visual size resets).

2. **Node Creation**  
   - A **+** button opens a prompt to add a new node by specifying its color.  
   - You can attach this new node to an existing node by referencing the existing node’s ID.

3. **Graph Reload**  
   - A **Reload** button sets the center of the screen as a temporary “center of gravity.”  
   - When triggered, the graph compresses toward this center and then slowly decompresses, creating a visually appealing animation.

## Getting Started
1. **Clone the Repository**

   ```bash
   git clone https://github.com/ohamz/liking-nodes-frontend

2. **Install Dependencies**

   Navigate to the project directory and install required packages:
   ```bash
   cd liking-nodes-frontend
   npm install
   ```
