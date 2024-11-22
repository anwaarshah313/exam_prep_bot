import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from 'next/router';
import config from "@/pages/api/config";

interface Data {
  evaluation: {
    answer: string;
    feedback: string;
    question: string;
    score: number;
    suggestions: string;
  }[];
}

export default function IndividualEvaluation() {
    const [cardId, setCardId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [data, setData] = useState<Data | null>(null); // Ensure your data type matches the expected structure
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                localStorage.setItem('userId', user.uid);
                setUserId(user.uid);
            } else {
                localStorage.removeItem('userId');
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query;
            setCardId(id as string);
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        if (userId && cardId) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${config.apiBaseUrl}/get_thread/${cardId}?user_id=${userId}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const jsonData: Data = await response.json();
                    setData(jsonData);
                    setLoading(false);
                } catch (error: any) {
                    console.error('Error fetching data:', error);
                    setError(error.message);
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [userId, cardId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            {/* <div>User ID: {userId}</div>
            <div>Card ID: {cardId}</div> */}
            <div>
                {data?.evaluation.map((item, index) => (
                    <div key={index}>
                        <h3>Question: {item.question}</h3>
                        <p>Answer: {item.answer}</p>
                        <p>Feedback: {item.feedback}</p>
                        <p>Score: {item.score}</p>
                        <p>Suggestions: {item.suggestions}</p>
                    </div>
                ))}
            </div>
        </>
    )
}
