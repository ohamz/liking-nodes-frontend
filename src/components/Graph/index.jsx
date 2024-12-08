import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import styles from "./graph.module.css";
import { useState } from "react";

function Graph({ nodes, links }) {
  const BASE_SIZE = 30;
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef();

  useEffect(() => {
    const width = window.innerWidth;
    const height = 600;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(customLinkDistance)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Add links
    const link = svg
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // Add nodes
    const node = svg
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("class", styles.node)
      .attr("r", (d) => Math.min(Math.max(d.likes + 25, 30), 60))
      .attr("fill", (d) => d.color)
      .call(drag(simulation))
      .on("mouseover", () => setIsHovered(true))
      .on("mouseout", () => setIsHovered(false))
      .on("click", function (event, d) {
        d.likes += 1;
        d3.select(this).attr("r", Math.min(Math.max(d.likes + 25, 30), 60));
        d3.select(`#text-${d.id}`).text(isHovered ? d.likes : d.id);
        simulation.alpha(1).restart(); // Restart simulation to update positions
      });

    // Add labels
    svg
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("id", (d) => `text-${d.id}`)
      .attr("class", styles.node_txt)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text((d) => (isHovered ? d.likes : d.id));

    // Update positions
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      svg
        .selectAll("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    });

    // Dragging behavior
    function drag(simulation) {
      return d3
        .drag()
        .on("start", (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on("end", (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        });
    }
  }, [nodes, links, isHovered]);

  return (
    <>
      {
        <h1
          className={`${styles.likes_txt} ${
            isHovered ? styles.likes_txt_hover : ""
          }`}
        >
          Likes are displayed
        </h1>
      }
      <svg ref={svgRef}></svg>
    </>
  );
}

function customLinkDistance(link) {
  const endsSize = Math.min(link.source.likes + link.target.likes, 80);
  const baseDistance = 80;
  return baseDistance + endsSize;
}

export default Graph;
