
import React, { useState } from 'react';
import styles from "./message.module.css";
import { FaEdit, FaPlus } from 'react-icons/fa';

interface Card {
  id: number;
  heading: string;
  description: string;
  progress: number;
}

export default function Message() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([
    { id: 1, heading: "Card 1", description: "Description of Card 1", progress: 20 },
    { id: 2, heading: "Card 2", description: "Description of Card 2Description of Card 2Description of Card 2", progress: 40 },
    { id: 3, heading: "Card 3", description: "Description of Card 3", progress: 60 },
    { id: 4, heading: "Card 4", description: "Description of Card 4", progress: 80 },
    { id: 5, heading: "Card 5", description: "Description of Card 5", progress: 50 },
    { id: 6, heading: "Card 6", description: "Description of Card 6", progress: 30 },
    { id: 7, heading: "Card 7", description: "Description of Card 7", progress: 70 },
    { id: 8, heading: "Card 8", description: "Description of Card 8", progress: 90 },
    { id: 9, heading: "Card 9", description: "Description of Card 9", progress: 10 },
    { id: 10, heading: "Card 10", description: "Description of Card 10", progress: 25 },

  
]);

const [editingId, setEditingId] = useState<number | null>(null);
const [errorMessage, setErrorMessage] = useState<string>('');
const [formData, setFormData] = useState<{ heading: string, description: string, progress: number }>({
  heading: '',
  description: '',
  progress: 0
});

const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: name === 'progress' ? Number(value) : value
  }));
};


  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
    setErrorMessage(''); 
    setFormData({
      heading: '',
      description: '',
      progress: 0
    });
  };

  const validateForm = () => {
    // Ensure all fields are filled
    if (!formData.heading || !formData.description || formData.progress === 0) {
      setErrorMessage('Please fill all fields before adding.');
      setTimeout(() => {
        setErrorMessage(''); // Clear the error message after 4 seconds
      }, 3000);
      return false;
    }
    return true;
  };

  const addOrUpdateCard = () => {
    if (validateForm()) {
      if (editingId != null) {
        const updatedCards = cards.map(card =>
          card.id === editingId ? { ...card, ...formData } : card
        );
        setCards(updatedCards);
        setEditingId(null);
      } else {
        const newCard = { ...formData, id: Math.random() };
        setCards([...cards, newCard]);
      }
      setFormData({ heading: '', description: '', progress: 0 });
      togglePopup();
    }
  };

  const startEditing = (id: number) => {
    const card = cards.find(card => card.id === id);
    if (card) {
      setFormData(card);
      setEditingId(id);
      togglePopup();
    }
  };

  
  return (
    <>
    {showPopup && <div className={styles.backdrop} />}
      <div className={styles.messageMain}>
        <div className={styles.messageIn}>
          <nav className={styles.inNav}>
          <button className={styles.addCardBtn} onClick={togglePopup}> Add Card <FaPlus className={styles.globleIcon}/></button>
          </nav>
          {showPopup && (
            <div className={styles.popupOut}>
                <button className={styles.closeBtn} onClick={closePopup}>X</button>
                {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                <div className={styles.inputOut}>
              <input
                type="text"
                placeholder="Heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                className={styles.input}
              />
              </div>
              <div className={styles.inputOut}>
              <textarea
                placeholder="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.input}
              />
              </div>
              <div className={styles.inputOut}>
              <input
                type="number"
                placeholder="Progress"
                name="progress"
                value={formData.progress}
                onChange={handleInputChange}
                className={styles.input}
              />
              </div>
              <button className={styles.addCardBtn} onClick={addOrUpdateCard}>Add</button>
            </div>
          )}
            <div className={styles.cardOut}>
          {cards.map(card => (

            <div key={card.id} className={styles.card}>
              <div className={styles.headRowOut}>
              <h3 className={styles.CardHead}>{card.heading}</h3>
              <button  className={styles.cardEditBtn} onClick={() => startEditing(card.id)}><FaEdit /></button>
              </div>
              <p className={styles.cardPra}>{card.description}</p>
              <progress className={styles.progressBar} value={card.progress} max="100"></progress>
              {/* <button className={styles.addCardBtn} onClick={() => startEditing(card.id)}> Edit <FaEdit  className={styles.globleIcon}/></button> */}
            </div>
          ))}
          </div>

        </div>
      </div>
    </>
  );
}
