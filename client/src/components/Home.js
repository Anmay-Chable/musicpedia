// Original: import React from 'react';
// Below added by Brendan ------------------------
import React, { useState } from 'react';        //
import { useNavigate } from 'react-router-dom'; //
// -----------------------------------------------

function Home() {
    // Below added by Brendan ----------------------------------
    const [query, setQuery] = useState('');                   //
    const navigate = useNavigate();                           //
    const handleSubmit = (e) => {                             //
        e.preventDefault();                                   //
        const params = new URLSearchParams();                 //
        if (query.trim()) params.set('search', query.trim()); //
        navigate(`/browse?${params.toString()}`);             //
    };                                                        //
    // ---------------------------------------------------------
    return (
        <main className="hero-section">

            {/* The Horizontal 3D Album Stack (TEMP)*/}
            <div className="album-stack">
                <img 
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500" 
                    className="album-cover album-left" 
                    alt="Album 1" 
                />
                <img 
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500" 
                    className="album-cover album-center" 
                    alt="Album 2" 
                />
                <img 
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500" 
                    className="album-cover album-right" 
                    alt="Album 3" 
                />
            </div>
            
            {/* Glass Panel */}
            <div className="glass-panel">
                <h1 className="logo-title">Welcome to Musicpedia</h1>
                {/* <form className="search-form" action="/browse"> */}
                {/* Below added by Brendan ----------------------------------- */}
                    <form className="search-form" onSubmit={handleSubmit}> {/* */}
                {/* ---------------------------------------------------------- */}
                    <span className="search-icon">&#128269;</span>
                    <input 
                        type="text" 
                        placeholder="Search for music..." 
                        className="search-input" 
                        name="search" 
                        // Below added by Brendan -------------------
                        value={query}                              //
                        onChange={(e) => setQuery(e.target.value)} //
                        // ------------------------------------------
                    />
                </form>
            </div>

        </main>
    );
}

export default Home;