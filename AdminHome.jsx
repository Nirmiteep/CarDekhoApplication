import React from 'react';
function copy1(e){
  e.preventDefault();
  alert("Copying is not allowed");
}

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome Designers & Developers</h1>
      <p onCopy={copy1} >Design our dream car today for our extensive collection.</p>
      <img 
        src="https://img.freepik.com/premium-photo/industrial-design-automotive-engineer-designer-working-3d-electric-car-design-using-smartphon_493343-41879.jpg?w=2000" 
        alt="Car"
        className="home-image"
      />
    </div>
  )
}

export default Home;
