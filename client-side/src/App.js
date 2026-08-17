import Navbar from './components/Navbar';// import component from Navbar.js
import Home from './components/Home';// import component from Home.js
import Browse from './components/Browse';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
      </Routes>
    </Router>
  );
}

export default App;