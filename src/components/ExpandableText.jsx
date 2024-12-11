
import React, { useState } from 'react';

export const ExpandableText = ({ text, maxCharacters = 150, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (text.length <= maxCharacters) {
        return <p className={className}>{text}</p>;
    }

    const toggleText = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`expandable-text ${className}`}>
            <p className="text">
                {isExpanded ? text : `${text.slice(0, maxCharacters)}...`}{' '}
                <span
                    className="toggle-btn text-yellow-500 hover:underline ml-1 text-sm cursor-pointer"
                    onClick={toggleText}
                >
                    {isExpanded ? 'mniej' : 'więcej'}
                </span>
            </p>
        </div>
    );
};
