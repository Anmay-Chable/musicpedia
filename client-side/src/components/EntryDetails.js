import React, { useState} from 'react';

function EntryDetails (){
    // state management
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        genre: '',
        year: '',
        descpt: ''
    });

    //auto updates, whenever a user types in a field
    const handleChange = (e) =>{
        const {name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]:value
        }));
    };

    //the submit handler
    const handleSubmit = (e) => {
        e.preventDefault(); // stops the page from reloading
        console.log("express Api: ", formData);

        setFormData({ title: '',artist: '',genre: '',year: '',descpt: ''});
        alert("Success");
    };
    
    return(
        <main className="details-container" >

            {/*Reusing glass panel css */}
            <div className="glass-panel form-panel">
                <h2 style={{ margin: '0 0 1rem 0'}}>Add New Album</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem'}}>
                    Enter the album/artist details below to save to the database
                </p>

            </div>
        </main>
    );
}

export default EntryDetails;