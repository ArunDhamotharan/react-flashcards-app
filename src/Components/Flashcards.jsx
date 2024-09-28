import React, { useState, useEffect } from 'react';
import './Flashcards.css';

export default function Flashcards() {
    const [flashcards, setFlashcards] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showAnswerPopup, setShowAnswerPopup] = useState(false); // Controls answer visibility in the popup
    const [deckName, setDeckName] = useState(); // Default deck name


    // Fetch the flashcards from localStorage when deckName changes
    useEffect(() => {
        if (deckName) {
            const storedFlashcards = localStorage.getItem(`flashcards-${deckName}`);
            if (storedFlashcards) {
                setFlashcards(JSON.parse(storedFlashcards));
                console.log("Flashcards fetched for deck:", deckName);
            } else {
                console.log("No flashcards found for deck:", deckName);
            }
        }
    }, [deckName]);

    // Save flashcards to localStorage whenever they change
    useEffect(() => {
        if (deckName && flashcards.length > 0) {
            localStorage.setItem(`flashcards-${deckName}`, JSON.stringify(flashcards));
            console.log("Flashcards saved for deck:", deckName);
        } else if (deckName) {
            localStorage.removeItem(`flashcards-${deckName}`);
            console.log("Flashcards removed for deck:", deckName);
        }
    }, [flashcards, deckName]);

    // Handle adding/editing a flashcard
    const handleFormSubmit = () => {
        if (question && answer) {
            if (isEditing && selectedCard) {
                const updatedCards = flashcards.map(card =>
                    card.id === selectedCard.id ? { ...card, question, answer } : card
                );
                setFlashcards(updatedCards);
                setIsEditing(false);
                setSelectedCard(null);
            } else {
                const newCard = {
                    id: Date.now(),
                    question,
                    answer
                };
                setFlashcards([...flashcards, newCard]);
            }
            setQuestion('');
            setAnswer('');
            setShowForm(false);
        }
    };

    // Handle selecting a card to view
    const handleCardClick = (card) => {
        setSelectedCard(card);
        setShowAnswerPopup(false);
    };

    // Close the popup window
    const handleClosePopup = () => {
        setSelectedCard(null);
    };

    // Delete the selected card
    const handleDelete = () => {
        if (selectedCard) {
            const updatedCards = flashcards.filter(card => card.id !== selectedCard.id);
            setFlashcards(updatedCards);
            handleClosePopup();
        }
    };

    return (
        <div className='flashcards-page'>
            <h1 className='deck-name'>{deckName}</h1>
            <button className='add-flashcard-button' onClick={() => { setShowForm(true); setIsEditing(false); }}>
                Add Flashcard
            </button>

            {showForm && (
                <div className='flashcard-form'>
                    <input
                        type='text'
                        placeholder='Question'
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className='form-input'
                    />
                    <input
                        type='text'
                        placeholder='Answer'
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className='form-input'
                    />
                    <button onClick={handleFormSubmit} className='form-submit-button'>
                        {isEditing ? 'Update Flashcard' : 'Add Flashcard'}
                    </button>
                </div>
            )}

            <div className='flashcards-list'>
                {flashcards.map((card) => (
                    <div
                        key={card.id}
                        className='flashcard-item'
                        onClick={() => handleCardClick(card)}
                    >
                        <div className='card'>
                            <div className='front'>
                                {card.question}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedCard && (
                <div className='flashcard-popup'>
                    <button className='close-button' onClick={handleClosePopup}>
                        <i className="fa-solid fa-left-long"></i>
                    </button>
                    <div className='popup-content'>
                        <p>{selectedCard.question}</p>
                        {showAnswerPopup ? (
                            <>
                                <h4>Answer:</h4>
                                <p>{selectedCard.answer}</p>
                            </>
                        ) : (
                            <button className='show-answer-button' onClick={() => setShowAnswerPopup(true)}>
                                Show Answer
                            </button>
                        )}
                    </div>
                    <button className='delete-button' onClick={handleDelete}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            )}
        </div>
    );
}
