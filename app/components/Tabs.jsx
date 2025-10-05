"use client";

export default function Tabs({ tabs, setCondition }) {
  function tabHandler(event, tabs) {
    if (event.target.className == tabs[0].ref.current.className) {
      tabs[1].ref.current.className = "tab";
      setCondition(true);
    } else {
      tabs[0].ref.current.className = "tab";
      setCondition(false);
    }

    event.target.className = "tab tab--active";
  }

  return (
    <div className="tabs">
      {tabs?.length &&
        tabs.map((x, index) => (
          <button
            key={index}
            ref={x.ref}
            className={`tab${(x.default && "  tab--active") ?? ""}`}
            onClick={(e) => tabHandler(e, tabs)}
          >
            {x.name}
          </button>
        ))}
    </div>
  );
}
