
// Editor.js - React component for editing templates
import React, { useState } from 'react';

const Editor = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [footer, setFooter] = useState('');
    const [imageUrls, setImageUrls] = useState([]);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('/uploadImage', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        setImageUrls([...imageUrls, data.imageUrl]);
    };

    const saveTemplate = async () => {
        const emailConfig = { title, content, footer, imageUrls };
        await fetch('/uploadEmailConfig', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailConfig),
        });
        alert('Template saved!');
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <input
                type="text"
                placeholder="Footer"
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
            />
            <input
                type="file"
                onChange={(e) => uploadImage(e.target.files[0])}
            />
            <button onClick={saveTemplate}>Save Template</button>
        </div>
    );
};

export default Editor;
