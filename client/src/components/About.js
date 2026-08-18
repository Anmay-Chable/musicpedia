import React from 'react';

function About() {
    return (
        <main className='about-container'>
            <div className='glass-panel about-panel'>
                <h2 style={{ marginBottom: '1rem', fontSize: '2rem'}}>About Musicpedia</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.1rem', marginBottom: '2.5rem'}}>
                    Musicpedia is a community-driven database dedicated to archiving history, production details and cultural impact of albums
                    across all genres. Our goal is to document the lore, the people and the stories behind the music.
                </p>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem'}}>
                    The Development Team
                </h3>
                <div className='team-grid'>
                    <div className='team-card'>
                        <h4>Angel May</h4>
                        <p>Front-End</p>
                    </div>
                    <div className='team-card'>
                        <h4>Brendan Gann</h4>
                        <p>Back-End</p>
                    </div>
                </div>
            </div>
        </main>

    );
}

export default About;