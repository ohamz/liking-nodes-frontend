import Graph from "./components/Graph";
import AddNode from "./components/AddNode";
import "./App.css";
import { useState, useEffect } from "react";
import { fetchNodes, fetchLinks, addNode, likeNode } from "./services/api";

function App() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  // Fetch initial graph data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedNodes = await fetchNodes();
        const fetchedLinks = await fetchLinks();
        setNodes(fetchedNodes);
        setLinks(fetchedLinks);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle adding a new node
  const handleAddNode = async (color, sourceId) => {
    try {
      const { node, link } = await addNode(color, sourceId);
      setNodes((prevNodes) => [...prevNodes, node]);
      setLinks((prevLinks) => [...prevLinks, link]);
    } catch (error) {
      console.error("Error adding node:", error);
    }
  };

  // Handle liking a node
  const handleLikeNode = async (nodeId) => {
    try {
      const updatedNode = await likeNode(nodeId);
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === updatedNode.id ? updatedNode : node
        )
      );
    } catch (error) {
      console.error("Error liking node:", error);
    }
  };

  return (
    <>
      <Graph nodes={nodes} links={links} likeNodeHandler={handleLikeNode} />
      <AddNode addNodeHandler={handleAddNode} />
    </>
  );
}

export default App;
