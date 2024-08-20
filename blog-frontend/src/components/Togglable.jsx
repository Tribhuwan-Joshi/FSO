import { useState, forwardRef, useImperativeHandle } from "react";
const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [isVisible, setIsVisible] = useState(false);
  const showWhenVisible = { display: isVisible ? "" : "none" };
  const hidenWhenVisible = { display: isVisible ? "none" : "" };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  useImperativeHandle(refs, () => {
    return { toggleVisibility };
  });
  return (
    <div>
      <button style={hidenWhenVisible} onClick={() => setIsVisible(true)}>
        {buttonLabel}
      </button>
      <div style={showWhenVisible}>
        {children}
        <button type="button" onClick={() => setIsVisible(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
});

export default Togglable;
