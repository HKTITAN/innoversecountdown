import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const QuoteDisplay: React.FC = () => {

    const [currentAnnouncement, setCurrentAnnouncement] = useState<{ message: string; duration: number } | null>(null);
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const socket = io('https://countdown-timer-em6a-fkgahixo0-aditya-kalias-projects.vercel.app');

        socket.on('announcement', ({ message, duration }) => {
            setCurrentAnnouncement({ message, duration });
            setTimeout(() => {
                setCurrentAnnouncement(null);
            }, duration * 1000);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const motivationalQuotes = [
        "Innovation distinguishes between a leader and a follower.",
        "The best way to predict the future is to create it.",
        "Every problem is an opportunity in disguise.",
        "Dream big, start small, but most of all, start.",
        "Where there is innovation, there is momentum.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Code your dreams into reality.",
        "Innovation is the key to unlocking tomorrow.",
        "Push beyond your limits."
    ];

    function getQuote() {
        const now = Date.now();
        const currentMinute = Math.floor(now / 60000);
        const quoteIndex = currentMinute % motivationalQuotes.length;
        return motivationalQuotes[quoteIndex];
    }


    useEffect(() => {
        setQuote(getQuote());
        const intervalId = setInterval(() => {
            setQuote(getQuote());
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className="quote-container">
            <div className="quote-header">Quote of the Minute</div>
            <div className="quote">
                {currentAnnouncement ? (
                    <div style={{color: 'red'}}>
                        {currentAnnouncement.message}
                    </div>
                ) : (
                    quote
                )}
            </div>
        </div>
    );
};

export default QuoteDisplay;