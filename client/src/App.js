import Navbar from './components/Navbar';// import component from Navbar.js
import Home from './components/Home';// import component from Home.js
import Browse from './components/Browse';
import EntryDetails from './components/EntryDetails';
import About from './components/About';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/details" element={<EntryDetails />} />
        <Route path="/edit/:id" element={<EntryDetails />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;