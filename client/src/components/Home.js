import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

function Home() {
    useDocumentTitle('Home');
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        setIsSearching(true);
        // helps with the loading screen timer
        setTimeout(() => {
            const params = new URLSearchParams();
            if (query.trim()) params.set('search', query.trim());
            navigate(`/browse?${params.toString()}`);
        }, 1500);
    };

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
                {isSearching ? (
                    <div className='search-loading-container'>
                        <div className='equalizer'>
                            <div className='bar bar1'></div>
                            <div className='bar bar2'></div>
                            <div className='bar bar3'></div>
                            <div className='bar bar4'></div>
                            <div className='bar bar5'></div>
                        </div>
                        <h3 className='loading-text'>Searching Musicpedia</h3>
                    </div>
                ):(
                    <>
                <div className='title-wrapper'>
                    <span className='title-prefix'>THE OPEN MUSIC WIKI</span>
                    <h1 className="logo-title gradient-brand">Musicpedia</h1>
                </div>
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
                </>
                )}
            </div>

        </main>
    );
}

export default Home;