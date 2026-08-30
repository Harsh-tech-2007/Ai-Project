import React from 'react';
import { useNavigate } from 'react-router';
import './NotFound.scss';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <main className='not-found-page'>
            <div className='not-found-card'>
                <div className='not-found-badge'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                <div className='not-found-code'>404</div>

                <h1>Page Not Found</h1>
                <p>
                    The page or resource you are attempting to reach does not exist, has been moved, or is temporarily unavailable.
                </p>

                <div className='not-found-actions'>
                    <button
                        onClick={() => navigate('/')}
                        className='btn-primary'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Back to Dashboard
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className='btn-secondary'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Previous Page
                    </button>
                </div>
            </div>
        </main>
    );
};

export default NotFound;
