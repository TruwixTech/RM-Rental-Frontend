import React, { useEffect, useState } from 'react';
import '../assets/csss/ScrollToTopButton.css';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 20) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            className={`scroll-to-top ${visible ? 'show' : ''}`}
            onClick={scrollToTop}
            title="Go to top"
        >
            &uarr;
        </button>
    );
};

export default ScrollToTopButton;
