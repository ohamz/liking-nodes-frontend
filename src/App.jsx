import Graph from "./components/Graph";
import AddNode from "./components/AddNode";
import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchNodes, fetchLinks, addNode, likeNode } from "./services/api";
import { WebSocketService } from "./services/wsClient";

export const WIDTH = window.innerWidth;
export const HEIGHT = window.innerHeight;

function App() {
  const nodesRef = useRef([]);
  const [links, setLinks] = useState([]);

  const handleAddNodeEvent = useCallback((message) => {
    if (message.event === "add_node") {
      const { node, link } = message.data;
      nodesRef.current.push(node);
      setLinks((prevLinks) => [...prevLinks, link]);
    }
  }, []);

  useEffect(() => {
    // Start connection and register listener for add_node events
    try {
      WebSocketService.connect(
        "wss://liking-nodes-backend-production.up.railway.app/ws"
      );
      WebSocketService.addListener(handleAddNodeEvent, { passive: true });
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }

    // Fetch initial graph data
    const fetchData = async () => {
      try {
        const fetchedNodes = await fetchNodes();
        const fetchedLinks = await fetchLinks();
        setLinks(fetchedLinks);
        nodesRef.current = fetchedNodes;
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };
    fetchData();

    return () => {
      WebSocketService.removeListener(handleAddNodeEvent);
      WebSocketService.disconnect();
    };
  }, []);

  // Handle adding a new node
  const handleAddNode = async (color, sourceId, onError) => {
    try {
      const { node, link } = await addNode(color, sourceId);

      // WebSocketService.send({
      //   event: "add_node",
      //   data: { node, link },
      // });

      console.log(`Node ${node.id} added.`);
      onError(null);
    } catch (error) {
      onError(error.message || "Something went wrong");
    }
  };

  // Handle liking a node
  const handleLikeNode = async (node) => {
    try {
      WebSocketService.send({
        event: "like_node",
        data: { id: node.id, likes: node.likes },
      });

      await likeNode(node.id);
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
