import { useState } from "react";
import styles from "./floatingButton.module.css";

function FloatingButton() {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  return (
    // <button className={styles.button} onClick={onClick}>
    //   <p>+</p>
    // </button>

    <div>
      <div
        className={`${styles.overlay} ${isPopupVisible ? styles.active : ""}`}
        onClick={togglePopup}
      ></div>

      <button
        className={styles.button}
        onClick={togglePopup}
        style={{
          transform: isPopupVisible ? "scale(0)" : "scale(1)", // Shrinks button when popup is active
        }}
      >
        <p>+</p>
      </button>

      <div className={`${styles.popup} ${isPopupVisible ? styles.active : ""}`}>
        <div className={styles.popup_content}>
          <div className={styles.popup_header}>Add New Node</div>
          <div className={styles.popup_body}>
            <label htmlFor="color">Pick a Color:</label>
            <input type="color" id="color" />
            <br />
            <label htmlFor="node">Connect to Node:</label>
            <select id="node">
              <option value="1">Node 1</option>
              <option value="2">Node 2</option>
            </select>
          </div>
          <button className={styles.popup_button} onClick={togglePopup}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloatingButton;
