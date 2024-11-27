import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from 'next/router';
import config from "@/pages/api/config";
import styles from "./individualevalution.module.css";
import { MdKeyboardBackspace } from "react-icons/md";

interface Evaluation {
    id: number;
    answer: string;
    feedback: string;
    question: string;
    score: number;
    suggestions: string;
}

interface Data {
    evaluation: Evaluation[];
}

interface TableField {
    label: string;
    key: keyof Evaluation;
}

const IndividualEvaluation: React.FC = () => {
    const [cardId, setCardId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [data, setData] = useState<Data | null>(null);
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
    }, [auth]);

    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query;
            if (typeof id === 'string') { // Properly handle the case where id might not be a string
                setCardId(id);
            } else if (Array.isArray(id)) {
                setCardId(id[0]); // Assuming the first id is the relevant one if it's an array
            }
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

    const tableFields: TableField[] = [
        { label: 'Question:', key: 'question' },
        { label: 'Answer:', key: 'answer' },
        { label: 'Feedback:', key: 'feedback' },
        { label: 'Score:', key: 'score' },
        { label: 'Suggestions:', key: 'suggestions' },
    ];

    return (
        <div className={styles.indiMain}>
            <div className={styles.indiIn}>
                <button className={styles.backBtn} onClick={() => router.push('/message')}><MdKeyboardBackspace /></button>

                {data && data.evaluation.length > 0 ? (  
                    data.evaluation.map((item, index) => (
                        <div className={styles.divRow} key={index}>
                            <table className={styles.table}>
                                <tbody className={styles.tableBody}>
                                    {tableFields.map(field => (
                                        <tr className={styles.tableRow} key={field.key}>
                                            <td className={styles.tableData}>{field.label}</td>
                                            <td className={styles.tableData}>{item[field.key]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : <p>No evaluations found</p>}
            </div>
        </div>
    );
}

export default IndividualEvaluation;
