import React from "react";

const tiles = [
  { 
    img: "/calling.png", 
    text: "SafeHer is a women’s safety application designed to provide real-time assistance in emergency situations. With features like calling pre-defined contacts, alerting the authorities, and sending location updates, SafeHer ensures that women can always feel secure, no matter where they are. This application is an essential tool for women who want to take control of their safety and well-being, especially in urban areas where safety can be a concern." 
  },
  { 
    img: "/danger.png", 
    text: "In a dangerous situation, SafeHer allows users to send an emergency alert with just one tap. The app immediately contacts emergency services and sends real-time location data. The integrated GPS system ensures that help can quickly reach the user, minimizing response time. This service is vital in critical situations where every second counts, providing peace of mind to users knowing that they have immediate access to assistance when needed." 
  },
  { 
    img: "/splash-icon-woman.png", 
    text: "SafeHer is designed with an intuitive user interface to make it easy for anyone to use, regardless of technical experience. The app’s functionality extends beyond just sending alerts. It includes a GPS tracker, a safe route planner, and an option to share location details with trusted contacts. Whether you're walking home late at night or traveling in unfamiliar places, SafeHer will help guide you to safety by offering the best options based on your current location." 
  },
  { 
    img: "/QR.png", 
    text: "Get SafeHer now and be prepared for any emergency. Scan the QR code to download the app via Expo and enjoy immediate access to its safety features. Stay safe and secure at all times with just the press of a button, having the app always ready in case of an emergency." 
  },
];

function App() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">
      {/* Heading Section */}
      <div className="w-full text-black bg-gray-800 text-center py-6 mb-8">
        <h1 className="text-6xl text-white font-extrabold">SafeHer</h1>
        <p className="text-xl text-white mt-2">Your Safety, Our Priority</p>
      </div>
      
      {/* Tile Section */}
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`flex items-center bg-white p-12 rounded-lg shadow-md w-full transform transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <img 
              src={tile.img} 
              alt="Tile" 
              className="w-[400px] h-[300px] object-cover rounded-md mr-8 transform transition-transform duration-300 hover:scale-110"
            />
            <p className="text-lg font-medium text-gray-700 transform transition-all duration-300 hover:text-blue-600">{tile.text}</p>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <footer className="w-full bg-gray-800 text-white py-4 mt-8">
        <div className="flex justify-center items-center gap-4">
          <p className="text-lg">&copy; 2025 SafeHer. All Rights Reserved.</p>
          <div className="flex gap-4">
           
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
