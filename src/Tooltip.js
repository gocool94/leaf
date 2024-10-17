import React, { useState } from "react";
import "./Tooltip.css";

const Tooltip = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div
      className="tooltip-container"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div className="tooltip-box">
          <div className="tooltip-content">{content}</div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
