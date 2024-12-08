import Graph from "./components/Graph";
import AddNode from "./components/AddNode";
import "./App.css";

function App() {
  const BASE_SIZE = 30;

  const nodes = [
    { id: 1, name: "Node 1", color: "#f28b82", radius: BASE_SIZE, likes: 0 },
    { id: 2, name: "Node 2", color: "#fbbc04", radius: BASE_SIZE, likes: 0 },
    { id: 30, name: "Node 2", color: "#fbbc04", radius: BASE_SIZE, likes: 0 },
    { id: 4, name: "Node 2", color: "#fbbc04", radius: BASE_SIZE, likes: 10 },
    {
      id: 5,
      name: "Nodeedede",
      color: "#fbbc04",
      radius: BASE_SIZE,
      likes: 20,
    },
  ];

  const links = [
    { source: 1, target: 2 },
    { source: 2, target: 30 },
    { source: 30, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 2 },
  ];

  return (
    <>
      <Graph nodes={nodes} links={links}></Graph>
      <AddNode />
    </>
  );
}

export default App;
