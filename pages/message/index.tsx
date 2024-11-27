
import React, { useState, useEffect ,ChangeEvent } from 'react';
import styles from "./message.module.css";
import { MdOutlineNextPlan } from "react-icons/md";
import config from "@/pages/api/config"
import { useRouter } from "next/router";


interface Card {
  id: number;
  heading: string;
  description: string;
  progress: number;
}

interface FormData {
  heading: string;
  description: string;
  progress: number;
}

export default function Message() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    heading: '',
    description: '',
    progress: 0
  });
  const router = useRouter();

  // Fetching data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await fetch(`${config.apiBaseUrl}/get_all_topics`);
      const data = await response.json();
        // Transform data to fit the Card interface and initial progress (assuming progress needed)
        const transformedData = data.map((item: any) => ({
          id: item.id,
          heading: item.title,
          description: item.description,
          progress: 0 // Default progress
        }));
        setCards(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

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

  const validateForm = (): boolean => {
    if (!formData.heading || !formData.description || formData.progress === 0) {
      setErrorMessage('Please fill all fields before adding.');
      setTimeout(() => {
        setErrorMessage(''); // Clear the error message after 4 seconds
      }, 4000);
      return false;
    }
    return true;
  };

  const addOrUpdateCard = () => {
    if (validateForm()) {
      if (editingId !== null) {
        const updatedCards = cards.map(card =>
          card.id === editingId ? { ...card, ...formData } : card
        );
        setCards(updatedCards);
        setEditingId(null);
      } else {
        const newCard = { ...formData, id: Math.random() * 10000 }; // Ensure unique ID, adjusted for randomness
        setCards([...cards, newCard]);
      }
      closePopup();
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
      <div className={styles.messageMain}>
        <div className={styles.messageIn}>
          <nav className={styles.inNav}>
          {/* Exam Stats >  */}
          </nav>
          {cards.length > 0 ? (
            <div className={styles.cardOut}>
              {cards.map(card => (
                <div key={card.id} className={styles.card}>
                  <h3 className={styles.CardHead}>{card.heading}</h3>
                  <p className={styles.cardPra}>{card.description}</p>
                  <button className={styles.cardEditBtn} onClick={() => router.push(`/topicresult?id=${card.id}`)}> See More...</button>
                </div>
              ))}
            </div>
          ) : <p>Nothing to show!</p>}
        </div>
      </div>
    </>
  );
}