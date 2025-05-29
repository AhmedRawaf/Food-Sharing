import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/Card';

const FAQPage: React.FC = () => {
    const faqs = [
        {
            question: "How does the food sharing platform work?",
            answer: "Our platform connects food donors with those in need. Donors can post available food items, and recipients can browse and request them. The platform facilitates communication and coordination between both parties."
        },
        {
            question: "Who can donate food?",
            answer: "Anyone can donate food! Whether you're an individual, restaurant, or grocery store, if you have surplus food that's still good to eat, you can list it on our platform."
        },
        {
            question: "What types of food can be donated?",
            answer: "You can donate any non-perishable food items, fresh produce, or prepared meals that are still safe to eat. Please ensure all donated food meets food safety standards and is properly packaged."
        },
        {
            question: "Is there a cost to use the platform?",
            answer: "No, our platform is completely free to use for both donors and recipients. We believe in making food sharing accessible to everyone."
        },
        {
            question: "How do I ensure food safety?",
            answer: "We recommend following basic food safety guidelines: proper storage, clear labeling of ingredients and expiration dates, and maintaining appropriate temperatures for perishable items."
        },
        {
            question: "Can I request specific food items?",
            answer: "Yes! You can browse available food items and make specific requests. However, availability depends on what donors have listed at any given time."
        },
        {
            question: "How do I communicate with donors/recipients?",
            answer: "Our platform includes a built-in messaging system that allows you to communicate directly with other users to coordinate pickups and ask questions."
        },
        {
            question: "What if I need to cancel a food request?",
            answer: "You can cancel a request at any time before the pickup is completed. We ask that you do this as early as possible to allow the donor to offer the food to someone else."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{faq.question}</h2>
                                <p className="text-gray-600">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FAQPage; 