
import axios from 'axios';
import { getFirestore, collection, query, where, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { app } from './firebaseConfig.js';
const db = getFirestore(app);

export const fetchNews = async (user, setNews) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/news`);
        const fetchedNews = response.data;
        if (user) {
            const userRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(userRef, where('userId', '==', user.uid)));

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0].data();
                const hiddenItems = userDoc.hiddenItems || [];
                const readItems = userDoc.readItems || [];

                // Update news with read and hidden items
                const updatedNews = fetchedNews.map(item => {
                    if (hiddenItems.includes(item.id)) {
                        return null; // Exclude hidden items
                    }

                    return {
                        ...item,
                        isRead: readItems.includes(item.id),
                    };
                });

                setNews(updatedNews.filter(Boolean)); // Filter out null values (hidden items)
            }
        } else {
            // User is not logged in, display all news
            setNews(fetchedNews);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
};

export const handleHide = async (user, itemId, navigate , setNews) => {
    if (user) {
        try {
            const userRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(userRef, where('userId', '==', user.uid)));

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'users', userDoc.id), {
                    hiddenItems: arrayUnion(itemId),
                });

                fetchNews(user, setNews); // Assuming setNews is a state setter function
                // eslint-disable-next-line no-undef
                Toast.success("Item Hidded");
            } else {
                console.log('User document not found.');
            }
        } catch (error) {
            console.error('Error hiding item:', error);
        }
    } else {
        navigate('/login');
    }
};

export const redirectToItemPage = async (user, itemId , setNews) => {
    if (user) {
        try {
            const userRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(userRef, where('userId', '==', user.uid)));

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'users', userDoc.id), {
                    readItems: arrayUnion(itemId),
                });
                window.open(`https://news.ycombinator.com/item?id=${itemId}`, '_blank');
                fetchNews(user, setNews);
            } else {
                console.log('User document not found.');
            }
        } catch (error) {
            console.error('Error marking item as read:', error);
        }
    }
    window.open(`https://news.ycombinator.com/item?id=${itemId}`, '_blank');
};

export const addItem = async (user, itemId ,setNews) => {
    if (user) {
        try {
            const userRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(userRef, where('userId', '==', user.uid)));

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'users', userDoc.id), {
                    readItems: arrayUnion(itemId),
                });
                fetchNews(user, setNews);
            } else {
                console.log('User document not found.');
            }
        } catch (error) {
            console.error('Error marking item as read:', error);
        }
    }
};