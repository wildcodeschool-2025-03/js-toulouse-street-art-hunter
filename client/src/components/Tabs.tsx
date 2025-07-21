// import { useState } from "react";
import tabsData from "../data/tabsData.tsx";
import "./Tabs.css";

function Tabs() {
  // const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="Tabs">
      <div className="OneTab">
        {tabsData.map((obj, index) => (
          <button key={obj.id} type="button">
            <div>
              <img src={obj.icon} alt="" />
              <span>{tabsData[index].tabTitle}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
