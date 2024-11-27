import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import config from "@/pages/api/config";
import styles from "./topicresult.module.css";
import { MdOutlineNextPlan, MdKeyboardBackspace } from "react-icons/md";

interface Evaluation {
  score: number;
}

interface Thread {
  id: string;
  title: string;
  evaluation: Evaluation[]; // Added type for evaluation
}

interface Data {
  threads: Thread[];
}

const TopicResult: React.FC = () => {
  const router = useRouter();
  const [cardId, setCardId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        localStorage.setItem("userId", user.uid);
        setUserId(user.uid);
      } else {
        localStorage.removeItem("userId");
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

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
          const response = await fetch(
            `${config.apiBaseUrl}/get_user_threads_by_topic?user_id=${userId}&topic_id=${cardId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const fetchedData: Data = await response.json();
          setData(fetchedData);
          setLoading(false);
        } catch (error: any) {
          console.error("Error fetching data:", error);
          setError(error.message);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userId, cardId]);

  // console.log(data.threads[2].evaluation.length*10)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.topicresultMain}>
      <div className={styles.topicresultIn}>
        <button className={styles.backBtn} onClick={() => router.push('/message')}><MdKeyboardBackspace /></button>
        {data && (
          <>
            {data.threads.length > 0 ? (
              <div className={styles.topicResultCardOut}>
                {data.threads.map((thread) => (
                  <div key={thread.id} className={styles.topicResultCard}>
                    <div className={styles.topicResultPraRowOut}>
                      <h3 className={styles.topicResultCardPra}>{thread.title}</h3>
                      {/* <button
                        className={styles.topicResultOpenBtn}
                        onClick={() => router.push(`/individualevalution?id=${thread.id}`)}
                      >
                        See More...
                      </button> */}
                    </div>

                    {/* Calculate and display the sum of scores for each thread */}
                    <div className={styles.scoreSum}>
                      Total Score
                      <span className={styles.scoreSpan}> {thread.evaluation.reduce((sum, ele) => sum + ele.score, 0)} </span>
                      out of
                      <span className={styles.scoreSpan}> {thread.evaluation.length * 10} </span>
                    </div>

                    <button
                      className={styles.topicResultOpenBtn}
                      onClick={() => router.push(`/individualevalution?id=${thread.id}`)}
                    >
                      See More...
                    </button>
                  </div>

                ))}
              </div>
            ) : (
              <p>No Data available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TopicResult;
