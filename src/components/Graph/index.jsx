import React, { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";

import styles from "./graph.module.css";
import { useState } from "react";
import { WIDTH, HEIGHT } from "../../App";
import { WebSocketService } from "../../services/wsClient";

function Graph({ nodes, links, likeNodeHandler }) {
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef();

  const handleLikeNodeEvent = useCallback(
    (message) => {
      if (message.event === "like_node") {
        const { id, likes } = message.data.node;
        const node = nodes.find((n) => n.id == id);
        if (node) {
          node.likes = likes;
          d3.select(`#node-${id}`).attr("r", Math.min(likes + 18, 40));
        }
      }
    },
    [nodes]
  );

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

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
      .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2));

    // Register the listener for like_node events
    WebSocketService.addListener(handleLikeNodeEvent);

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
      .attr("id", (d) => `node-${d.id}`)
      .attr("class", styles.node)
      .attr("r", (d) => Math.min(d.likes + 18, 40))
      .attr("fill", (d) => d.color)
      .call(drag(simulation))
      .on("mouseover touchstart", (event, d) => {
        setIsHovered(true);
        svg.selectAll("text").text((d) => d.likes);
        svg.selectAll("circle").style("opacity", 0.4);
      })
      .on("mouseout touchend", (event, d) => {
        setIsHovered(false);
        svg.selectAll("text").text((d) => d.id);
        svg.selectAll("circle").style("opacity", 1);
      })
      .on("click", (event, d) => {
        likeNodeHandler(d);
        d.likes += 1;
        d3.select(event.target).attr("r", Math.min(d.likes + 18, 40));
        d3.select(`#text-${d.id}`).text(d.likes);
        simulation.alpha(1).restart();
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
  }, [nodes, links]);

  return (
    <>
      <div className={styles.title_box}>
        <h1
          className={`${styles.likes_txt} ${
            isHovered ? styles.likes_txt_hover : ""
          }`}
        >
          Likes are displayed
        </h1>

        <h1
          className={`${styles.main_txt} ${
            isHovered ? styles.main_txt_hover : ""
          }`}
        >
          Click a Node to like it
        </h1>
      </div>
      <svg ref={svgRef}></svg>
    </>
  );
}

function customLinkDistance(link) {
  const endsSize = Math.min(link.source.likes + link.target.likes, 20);
  const baseDistance = 60;
  return baseDistance + endsSize;
}

export default Graph;
