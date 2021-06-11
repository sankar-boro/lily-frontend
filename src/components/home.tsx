import React from "react";

const Home = () => {
  return (
    <div>
      Home
      <a
        href="#login"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Take me to login
      </a>
    </div>
  );
};

export default Home;
