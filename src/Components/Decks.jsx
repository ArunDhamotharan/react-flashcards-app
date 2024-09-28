import React, { useState, useEffect } from 'react';
import './Decks.css';
import { Link } from 'react-router-dom';

export default function Decks() {
    const [deckName, setDeckName] = useState("");
    const [decks, setDecks] = useState([]);
    const [isCreatingDeck, setIsCreatingDeck] = useState(false);
    const [userName, setUserName] = useState("");

    // Load decks and username from localStorage
    useEffect(() => {
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }

        const storedDecks = localStorage.getItem("decks");
        if (storedDecks) {
            setDecks(JSON.parse(storedDecks));
        }
    }, []);

    // Save decks to localStorage whenever decks change
    useEffect(() => {
        if (decks.length > 0) {
            localStorage.setItem("decks", JSON.stringify(decks));
        } else {
            localStorage.removeItem("decks"); 
        }
    }, [decks]);

    // Save username to localStorage whenever username changes
    useEffect(() => {
        if (userName) {
            localStorage.setItem("userName", userName);
        }
    }, [userName]);

    // Toggle the create deck form
    const handleCreateDeckClick = () => {
        setIsCreatingDeck(!isCreatingDeck);
    };

    // Handle deck name input change
    const handleDeckNameChange = (event) => {
        setDeckName(event.target.value);
    };

    // Add a new deck to the list
    const handleAddDeck = () => {
        if (deckName) {
            setDecks(prevDecks => [{ name: deckName, id: Date.now() }, ...prevDecks]);
            setDeckName("");
            setIsCreatingDeck(false);
        }
    };

    // Delete a deck by ID
    const handleDeleteDeck = (event, id) => {
        event.preventDefault();  // Prevent navigation
        event.stopPropagation(); // Prevent the click event from propagating to the link
        if (window.confirm("Are you sure you want to delete this deck?")) {
            setDecks(prevDecks => prevDecks.filter(deck => deck.id !== id));
        }
    };

    return (
        <div className='decks-page'>
            {userName && (
                <div className='greeting-message'>
                    {`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, `}<span className='name'>{userName}</span>!
                </div>
            )}
            <div className='create-deck-container'>
                <button className='create-deck-button' onClick={handleCreateDeckClick}>
                    {isCreatingDeck ? "Cancel" : "Create Deck"}
                </button>

                {isCreatingDeck && (
                    <div className='create-deck-form'>
                        <input
                            type='text'
                            placeholder='Enter deck name'
                            value={deckName}
                            onChange={handleDeckNameChange}
                            className='deck-name-input'
                        />
                        <button className='add-deck-button' onClick={handleAddDeck}>
                            Add Deck
                        </button>
                    </div>
                )}
            </div>

            <div className='decks-list'>
                {decks.map((deck) => (
                    <Link 
                        key={deck.id} 
                        to={`/flashcards/${deck.name}`} 
                        className='deck-link'
                    >
                        <div className='deck-item'>
                            {deck.name}
                            <button 
                                className='delete-deck-button' 
                                onClick={(e) => handleDeleteDeck(e, deck.id)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
