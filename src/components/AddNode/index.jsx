import { useState } from "react";
import styles from "./addNode.module.css";
import { COLORS } from "../../constants/colors";

function AddNode({ addNodeHandler }) {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSource, setSelectedSource] = useState(1);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <div>
      <div
        className={`${styles.overlay} ${isPopupVisible ? styles.active : ""}`}
        onClick={togglePopup}
      ></div>

      <button
        className={styles.button}
        onClick={togglePopup}
        style={{
          transform: isPopupVisible ? "scale(0)" : "scale(1)",
          transition: "0.4s all ease",
        }}
      >
        <p>+</p>
      </button>

      <div className={`${styles.popup} ${isPopupVisible ? styles.active : ""}`}>
        <div className={styles.popup_content}>
          <div>
            <div className={styles.popup_header}>Add New Node</div>
            <div className={styles.popup_body}>
              <div className={styles.color_input_box}>
                <label htmlFor="color">Pick a Color:</label>
                <div className={styles.color_picker}>
                  {COLORS.map((color) => (
                    <div
                      key={color}
                      className={`${styles.color_circle} ${
                        selectedColor === color ? styles.selected : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    ></div>
                  ))}
                </div>
              </div>
              <br />
              <div className={styles.node_input_box}>
                <label htmlFor="node">Connect to Node:</label>
                <input
                  id="node"
                  placeholder="Node ID"
                  required
                  onChange={(event) => {
                    setSelectedSource(event.target.value);
                  }}
                ></input>
              </div>
            </div>
          </div>
          <button
            className={styles.popup_button}
            onClick={() => {
              togglePopup();
              addNodeHandler(selectedColor, selectedSource);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNode;
