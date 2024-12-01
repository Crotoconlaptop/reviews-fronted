import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VoteScreen from './pages/VoteScreen';
import Header from './components/Header';
import PlaceDetails from './pages/PlaceDetails';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vote" element={<VoteScreen />} />
                <Route path="/details/:placeId" element={<PlaceDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
