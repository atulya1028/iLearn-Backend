import React from "react";
import "../App.css";
import Lottie from "lottie-react";
import ai from '../assets/ai.json';

export default function Business() {
  return (
    <div className="nav-container">
      <div style={{ paddingTop: "30px" }}></div>
      <div className="nav-para">
        Our motive is to provide best service so that collaboration team and
        investors can take interest that what is the purpose of selling a best
        book according to learners need. So for franchise and collaboration
        purpose please mail us at: &nbsp;
        <a href="mailto:atulyaagrawal1996@gmail.com" style={{ color: "blue" }}>
          Send Email
        </a>
      </div>
     <div style={{width:'50%',margin:'auto'}}>
     <Lottie animationData={ai} />
     </div>
    </div>
  );
}
