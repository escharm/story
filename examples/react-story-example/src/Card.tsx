import { useState } from "react";

const Card = () => {
  const [count, setCount] = useState(0);

  return (
    <div data-id="bRlWg5-YK3YsZupGs6V9s" className="card">
      <button data-id="BxYi_BgWPoBiLmucMf_-A" onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p data-id="DeweYV23G9-4djyfOlOC3">
        Edit <code data-id="-g96V6Jp_MZLqY4uafELJ">src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
};

export default Card;
