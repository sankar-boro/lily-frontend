import React from "react";

const Signup = () => {
  return (
    <div>
      <form action="#" method="post">
        <div>
          <input type="text" placeholder="Email" name="email" required />
        </div>
        <div>
          <input type="text" placeholder="First Name" name="fname" />
        </div>
        <div>
          <input type="text" placeholder="Last Name" name="lname" required />
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

export default Signup;
