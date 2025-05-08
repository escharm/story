import { useState } from "react";

const Card = () => {
  const [count, setCount] = useState(0);

  return (
    <div data-id="KwFWRRU3i27PY2VjHwJXb" className="card">
      <button data-id="nEA6O2eNC-1Kbcf2xqDaq" onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p data-id="w0HwBwK5RAoIKkfh9xo96">
        Edit <code data-id="D5bHYwz7uEQrjHJY2eAPf">src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
};

export default Card;
