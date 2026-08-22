import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GENRES } from '../Constants';
import useDocumentTitle from '../hooks/useDocumentTitle';

function EntryDetails (){
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    useDocumentTitle(isEditMode ? 'Edit Album' : 'Add New Album');

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [useOtherGenre, setUseOtherGenre] = useState(false);

    // state management
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        genre: '',
        year: '',
        label: '',
        producer: '',
        backgroundInfo: '',
        entryType: 'auto',
    });

    useDocumentTitle(isEditMode ? (formData.title || 'Edit Album') : 'Add New Album');

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
                    entryType: album.entryType || '',
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

    // auto updates, whenever a user types in a field
    const handleChange = (e) => {
        const {name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]:value
        }));
    };

    // genre <select> has its own handler since choosing "Other" needs to
    // reveal a free-text input instead of directly setting formData.genre
    const handleGenreSelect = (e) => {
        const value = e.target.value;
        if (value === 'Other') {
            setUseOtherGenre(true);
            setFormData((prev) => ({ ...prev, genre: '' }));
        }
        else {
            setUseOtherGenre(false);
            setFormData((prev) => ({ ...prev, genre: value }));
        }
    };

    //the submit handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // stops the page from reloading
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

            //if (!isEditMode) {
            //    setFormData({ title: '', artist: '', genre: '', year: '', label: '', producer: '', backgroundInfo: '' });
            //}
            //alert(isEditMode ? 'Album updated' : "Success");
            
            navigate('/browse', {
                state: { toastMessage: isEditMode ? 'Album updated' : 'Album published' },
            });
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

                    <div className='form-group'>
                        <label>Entry Type</label>
                        <div className='entry-type-toggle'>
                            <button
                                type='button'
                                className={formData.entryType === 'auto' ? 'active' : ''}
                                onClick={() => setFormData((prev) => ({ ...prev, entryType: 'auto' }))}
                            >
                                Auto-Detect
                            </button>
                            <button
                                type='button'
                                className={formData.entryType === 'album' ? 'active' : ''}
                                onClick={() => setFormData((prev) => ({ ...prev, entryType: 'album' }))}
                            >
                                Album
                            </button>
                            <button
                                type='button'
                                className={formData.entryType === 'song' ? 'active' : ''}
                                onClick={() => setFormData((prev) => ({ ...prev, entryType: 'song' }))}
                            >
                                Song / Single
                            </button>
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
                            <select id='genre' name='genre' value={useOtherGenre ? 'Other' : formData.genre} onChange={handleGenreSelect} className='form-input' required>
                                <option value="" disabled>Select a genre</option>
                                {GENRES.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                            {useOtherGenre && (
                                <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder='Enter genre' className="form-input" style={{ marginTop: '0.5rem' }} required />
                            )}
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