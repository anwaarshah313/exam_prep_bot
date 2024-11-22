import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import config from "@/pages/api/config"
import styles from "./topicresult.module.css";
import { MdOutlineNextPlan } from "react-icons/md";


interface Thread {
  id: string;
  title: string;
}

interface Data {
  threads: Thread[];
}

const TopicResult: React.FC = () => {
  const router = useRouter();
  const [cardId, setCardId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Adjusted for consistency
  const [data, setData] = useState<Data | null>(null); // State to hold fetched data
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading status
  const [error, setError] = useState<string | null>(null); // State to handle any fetch errors

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
    // Only attempt to fetch if both userId and cardId are not null
    if (userId && cardId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/get_user_threads_by_topic?user_id=${userId}&topic_id=${cardId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data: Data = await response.json();
          setData(data);
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
    <div className={styles.topicresultMain}>
      <div className={styles.topicresultIn}>

        {data && (
          <>
            <h2>Thread IDs</h2>
            <div className={styles.topicResultCardOut}>
            {data.threads.map(thread => (
              <div key={thread.id} className={styles.topicResultCard}>
                 <div className={styles.topicResultPraRowOut}>
                <p className={styles.topicResultCardPra}>{thread.title}</p>
                <button className={styles.topicResultOpenBtn} onClick={() => router.push(`/individualevalution?id=${thread.id}`)}><MdOutlineNextPlan /></button>
                </div>
                {thread.evaluation.length*10}

              {/* Calculate and display the sum of scores for each thread */}
          <div className={styles.scoreSum}>
            Total Score: {thread.evaluation.reduce((sum, ele) => sum + ele.score, 0)}
          </div>
          {thread.evaluation.map((ele, index) => (
            <div key={`${thread.id}-${index}`}>
              {ele.score}
            </div>
          ))}
              </div>
            ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default TopicResult;
