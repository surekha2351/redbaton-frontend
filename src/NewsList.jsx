/* eslint-disable react/react-in-jsx-scope */
// NewsList.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from './firebaseConfig.js';
import { fetchNews, handleHide, redirectToItemPage, addItem } from './Functions.js';

const auth = getAuth(app);

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 30;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNews(user, setNews);
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const totalPages = Math.ceil(news.length / itemsPerPage);

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    const renderNavbar = () => {
        return (
            <nav className="navbar navbar-expand-lg d-flex justify-content-between flex-nowrap navbar-dark bg-dark">
                <a className="navbar-brand mx-4 logobrand" href="/">
                    HackNews Clone
                </a>
                <div className="custom-navbar-collapse mx-4">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            {user ? (

                                <div>
                                    <button onClick={()=>{navigate('/hidden-items')}} className="btn userin btn-danger">
                                        Hidden Items
                                    </button>

                                    <button onClick={handleLogout} className="btn userin btn-danger">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <button onClick={() => { navigate('/login') }} className="btn btn-primary mx-2">
                                        Login
                                    </button>
                                    <button onClick={() => { navigate('/signup') }} className="btn btn-success mx-2">
                                        Signup
                                    </button>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
        );
    };

    const renderNews = () => {
        if (news.length === 0) {
            return <p>Loading...</p>;
        }

        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentNews = news.slice(startIndex, endIndex);

        return (
            <ol start={startIndex + 1} style={{listStyle: 'none'}}>
                {currentNews.map((item) => (
                    <li key={item.id} style={{ color: item.isRead ? 'grey' : 'inherit' }}>
                        <div className="newsItem">
                            <div className="titleAndUrl">
                                {item.url ? (
                                    <a href={item.url} onClick={() => addItem(user, item.id, setNews)} target="_blank" rel="noopener noreferrer">
                                        <span><strong style={{ color: item.isRead ? 'grey' : '#213547' }}>{item.title}</strong></span>
                                        <span style={{ color: 'blue' }}>
                                            Read More
                                        </span>
                                    </a>
                                ) : (
                                    <div onClick={() => redirectToItemPage(user, item.id, setNews)} style={{ cursor: 'pointer' }}>
                                        <span><strong style={{ color: '#213547' }}>{item.title}</strong></span>
                                        <span style={{ color: 'blue' }}>
                                            Read More
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="authorAndDatePosted">
                                <span>
                                    Author: <a href={`https://news.ycombinator.com/user?id=${item.by}`} target="_blank" rel="noopener noreferrer">
                                        <i><b>{item.by}</b></i>
                                    </a>
                                </span>
                                <span>
                                    posted on: <b>{new Date(item.time * 1000).toLocaleString()}</b>
                                </span>
                            </div>
                            <div className="upvotesAndComments">
                                <span>
                                    <b>{item.score}</b> points
                                </span>
                                <span>
                                    <a href={`https://news.ycombinator.com/item?id=${item.id}`} target="_blank" rel="noopener noreferrer">
                                        <b>{item.descendants}</b> comments
                                    </a>
                                </span>
                                <span onClick={() => handleHide(user, item.id, navigate, setNews)} style={{cursor:'pointer'}}>
                                    Hide
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        );
    };

    const renderPagination = () => {
        const pages = Array.from({ length: totalPages }, (_, index) => index);

        return (
            <div className='pagination'>
                {pages.map((page) => (
                    <button key={page} onClick={() => handleClick(page)}
                        className={currentPage === page ? 'currentPageButton' : ''}
                    >
                        {page + 1}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div>
            {renderNavbar()}
            {renderNews()}
            {renderPagination()}
        </div>
    );
};

export default NewsList;