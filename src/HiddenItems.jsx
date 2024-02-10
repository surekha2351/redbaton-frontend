
import  { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchNews } from './Functions.js';
import { app } from './firebaseConfig.js';
const auth = getAuth(app);
const db = getFirestore(app);
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HiddenItems = () => {
    const [user, setUser] = useState(null);
    const [hiddenItems, setHiddenItems] = useState([]);
    const [news, setNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (!user) {
                navigate('/login');
              }        
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchHiddenItems(user, setHiddenItems);
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchNews(null, setNews);
        };

        fetchData();
    }, [user, hiddenItems]);

    const fetchHiddenItems = async (user, setHiddenItems) => {
        if (user) {
            try {
                const userRef = collection(db, 'users');
                const querySnapshot = await getDocs(query(userRef, where('userId', '==', user.uid)));

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0].data();
                    const userHiddenItems = userDoc.hiddenItems || [];
                    setHiddenItems(userHiddenItems);
                }
            } catch (error) {
                console.error('Error fetching hidden items:', error);
            }
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (user) {
            try {
                const userRef = collection(db, 'users');
                const querySnapshot = await getDocs(query(userRef, where('userId', '==', user.uid)));

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    await updateDoc(doc(db, 'users', userDoc.id), {
                        hiddenItems: arrayRemove(itemId),
                    });

                    await fetchHiddenItems(user, setHiddenItems);
                } else {
                    console.log('User document not found.');
                }
            } catch (error) {
                console.error('Error removing hidden item:', error);
            }
        }
    };

    const renderHiddenItems = () => {
        if (!hiddenItems || hiddenItems.length === 0) {
            return <p style={{ height:'100vh', display:'grid',placeItems:'center'}}>No hidden items</p>;
        }

        return (
            <div>
                <button onClick={() => { navigate('/') }} className='m-3 btn btn-outline-dark'>Home</button>
                <h2 className="my-4 text-center">Hidden Items</h2>
                <ul className="list-group">
                    {news.map((item) => (
                        hiddenItems.includes(item.id) ? (
                            <li key={item.id} className="m-2">
                                <div>
                                    <a href={item.url} target='_blank' className="text-decoration-none mx-2" rel="noreferrer">
                                        {item.title}
                                    </a>
                                    <Button variant="danger" size="sm" onClick={() => handleRemoveItem(item.id)}>
                                        Remove
                                    </Button>
                                </div>
                            </li>
                        ) : null
                    ))}
                </ul>
            </div>
        );
    };

    return <div className="container">{renderHiddenItems()}</div>;
};

export default HiddenItems;