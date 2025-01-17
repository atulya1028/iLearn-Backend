import React from "react";
import '../App.css';
import Lottie from "lottie-react";
import ai from '../assets/ai.json';

export default function About() {
  return (
    <>
      <div className="nav-container">
        <div style={{ height: "50px" }}></div>
        <p className="nav-para">
          <p>iLearn is an e-book website where readers can read different types of
          books. It was created by Atulya Agrawal who is passionate about
          creating different things while exploring each one feel like they are
          in the library.</p>
          <br />
          <br />
          As readers face difficulties while they are not getting their favorite
          books they need to pay for them. iLearn provides books from different
          countries' authors with the best prices and some of the books are
          available for free of cost.
          <br />
          <br />
          We provide the best content to our customers our main motive is that
          we provide as many books as possible to readers who can buy and read
          online and can listen to audio and video books also provides some fun
          games for little kids.
        </p>
        <div style={{width:'50%',margin:'auto'}}>
     <Lottie animationData={ai} />
     </div>
      </div>
    </>
  );
}
