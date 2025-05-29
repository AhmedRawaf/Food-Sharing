import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Button from '../ui/Button';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    donorName: string;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSubmit, donorName }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setRating(0);
            setComment('');
            setHoverRating(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (rating > 0) {
            onSubmit(rating, comment);
            onClose();
        }
    };

    const handleStarClick = (star: number) => {
        setRating(star);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">Rate {donorName}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="flex justify-center space-x-4 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none p-2"
                                    onClick={() => handleStarClick(star)}
                                    onTouchStart={() => setHoverRating(star)}
                                    onTouchEnd={() => setHoverRating(0)}
                                >
                                    <Star
                                        className={`h-10 w-10 ${star <= (hoverRating || rating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment (optional)"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="px-4 py-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={rating === 0}
                            className="px-4 py-2"
                        >
                            Submit Rating
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal; 