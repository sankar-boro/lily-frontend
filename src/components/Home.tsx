import React from "react";

const Home = () => {
  return (
    <div>
      Home
      <button
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
