import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EntryDetails (){
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(isEditMode);

    // state management
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        genre: '',
        year: '',
        label: '',
        producer: '',
        backgroundInfo: ''
    });

    // auto updates, whenever a user types in a field
    const handleChange = (e) =>{
        const {name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]:value
        }));
    };

    // If we're editing an existing album, load its data into the form
    useEffect(() => {
        if (!isEditMode) return;
        const loadAlbum = async () => {
            try {
                const res = await fetch(`/api/albums/${id}`);
                if (!res.ok) throw new Error('Album not found');
                const album = await res.json();
                setFormData({
                    title: album.title || '',
                    artist: album.artist || '',
                    genre: album.genre || '',
                    year: album.year || '',
                    label: album.label || '',
                    producer: album.producer || '',
                    backgroundInfo: album.backgroundInfo || '',
                });
            }
            catch (err) {
                setSubmitError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        loadAlbum();
    }, [id, isEditMode]);

    //the submit handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // stops the page from reloading
        // console.log("express Api ready: ", formData);

        setSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch(isEditMode ? `/api/albums/${id}` : '/api/albums', {
                method: isEditMode ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Failed to ${isEditMode ? 'update' : 'publish'} entry`);
            }
            if (!isEditMode) {
                setFormData({ title: '', artist: '', genre: '', year: '', label: '', producer: '', backgroundInfo: '' });
            }
            alert(isEditMode ? 'Album updated' : "Success");
            navigate('/browse');
        }
        catch (err) {
            setSubmitError(err.message);
        }
        finally {
            setSubmitting(false);
        }
    };
    
    if (loading) {
        return (
            <main className='details-container'>
                <div className='glass-panel form-panel'>
                    <p>Loading album...</p>
                </div>
            </main>
        )
    }
    
    return(
        <main className="details-container" >

            {/*Reusing glass panel css */}
            <div className="glass-panel form-panel">
                <h2 style={{ margin: '0 0 1rem 0'}}>{isEditMode ? 'Edit Album' : 'Add New Album'}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem'}}>
                    {isEditMode
                        ? "Update this album's history, production details and legacy."
                        : "Document a new album's history, production details and legacy."}
                </p>

                <form onSubmit={handleSubmit} className='details-form'>
                    {/* Info row */}
                    <div className='form-group row-group'>
                        <div className='half-width'>
                            <label htmlFor='title'>Album Title</label>
                            <input type="text" id='title' name='title' value={formData.title} onChange={handleChange} required className='form-input' />
                        </div>
                        <div className='half-width'>
                            <label htmlFor='artist'>Primary Artist</label>
                            <input type="text" id='artist' name='artist' value={formData.artist} onChange={handleChange} required className='form-input' />
                        </div>
                    </div>

                    {/* wiki-specific data row */}
                    <div className='form-group row-group'>
                        <div className="half-width">
                            <label htmlFor="label">Record Label</label>
                            <input type="text" id="label" name="label" value={formData.label} onChange={handleChange} className="form-input" placeholder="e.g. Columbia Records" />
                        </div>
                        <div className="half-width">
                            <label htmlFor="producer">Producer(s)</label>
                            <input type="text" id="producer" name="producer" value={formData.producer} onChange={handleChange} className="form-input" placeholder="e.g. Rick Rubin" />
                        </div>    
                    </div>

                    {/* Classification Row */}
                    <div className="form-group row-group">
                        <div className="half-width">
                            <label htmlFor="genre">Genre</label>
                            <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} required className="form-input" />
                        </div>
                        <div className="half-width">
                            <label htmlFor="year">Release Year</label>
                            <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} required className="form-input" />
                        </div>
                    </div>

                    {/* Lore Section */}
                    <div className="form-group">
                        <label htmlFor="backgroundInfo">Background & Historical Context</label>
                        <textarea 
                            id="backgroundInfo" 
                            name="backgroundInfo" 
                            value={formData.backgroundInfo} 
                            onChange={handleChange} 
                            className="form-input textarea-input"
                            rows="5"
                            placeholder="Detail the recording process, historical impact, or trivia..."
                        />
                    </div>
                    {/* Original: <button type="submit" className="submit-btn">Publish Entry</button> */}

                    {submitError && <p className="form-error">{submitError}</p>}
                    <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting
                            ? (isEditMode ? 'Saving...' : 'Publishing...')
                            : (isEditMode ? 'Save Changes' : 'Publish Entry')}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default EntryDetails;