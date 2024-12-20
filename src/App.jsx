import Graph from "./components/Graph";
import AddNode from "./components/AddNode";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { fetchNodes, fetchLinks, addNode, likeNode } from "./services/api";

export const WIDTH = window.innerWidth;
export const HEIGHT = window.innerHeight - 10;

function App() {
  // const [nodes, setNodes] = useState([]);
  const nodesRef = useRef([]);
  const [links, setLinks] = useState([]);

  // Fetch initial graph data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedNodes = await fetchNodes();
        const fetchedLinks = await fetchLinks();
        // setNodes(fetchedNodes);
        setLinks(fetchedLinks);
        nodesRef.current = fetchedNodes;
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle adding a new node
  const handleAddNode = async (color, sourceId, onError) => {
    try {
      const { node, link } = await addNode(color, sourceId);
      console.log(`Node ${node.id} added.`);
      nodesRef.current.push(node);
      setLinks((prevLinks) => [...prevLinks, link]);
      onError(null);
    } catch (error) {
      onError(error.message || "Something went wrong");
    }
  };

  // Handle liking a node
  const handleLikeNode = async (node) => {
    try {
      likeNode(node.id);
    } catch (error) {
      console.error("Error liking node:", error);
    }
  };

  return (
    <>
      <Graph
        nodes={nodesRef.current}
        links={links}
        likeNodeHandler={handleLikeNode}
      />
      <AddNode addNodeHandler={handleAddNode} />
    </>
  );
}

export default App;
