import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            navigate('/');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="max-w-md mx-auto px-4">
                    <Card className="p-6">
                        <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                                fullWidth
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                required
                                fullWidth
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                isLoading={isLoading}
                            >
                                Login
                            </Button>

                            <p className="text-center text-sm text-gray-600">
                                Don't have an account?{' '}
                                <a href="/signup" className="text-green-600 hover:text-green-700">
                                    Sign up
                                </a>
                            </p>
                        </form>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LoginPage; 