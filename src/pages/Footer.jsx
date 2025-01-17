import React from 'react'

export const Footer = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height:'100px',
          backgroundColor: "white",
          padding: "50px",
          borderTop:'1px solid gray'
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            textAlign: "flex-start",
            color: "black",
          }}
        >
          {" "}
          <div>&copy; iLearn 2024</div>
        </div>
      </div>
    </>
  )
}
