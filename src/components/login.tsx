import React from "react";

const Login = () => {
  return (
    <div>
      <form action="#" method="post">
        <div>
          <input type="text" placeholder="Email" name="email" required />
        </div>
        <div>
          <input type="text" placeholder="Password" name="password" required />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
