import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
    value: number;
    onChange?: (value: number) => void;
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const Rating: React.FC<RatingProps> = ({ value, onChange, readOnly = false, size = 'md' }) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const handleClick = (newValue: number) => {
        if (!readOnly && onChange) {
            onChange(newValue);
        }
    };

    const handleMouseEnter = (newValue: number) => {
        if (!readOnly) {
            setHoverValue(newValue);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverValue(null);
        }
    };

    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverValue || value) >= star;
                return (
                    <button
                        key={star}
                        type="button"
                        className={`${!readOnly ? 'cursor-pointer' : 'cursor-default'} p-1`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                        disabled={readOnly}
                    >
                        <Star
                            className={`${sizeClasses[size]} ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default Rating; 