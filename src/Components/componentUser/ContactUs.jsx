import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faComment, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const ContactUs = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate form submission
        setTimeout(() => {
            alert(t('contact_thank_you', { defaultValue: 'Thank you for your message! We will get back to you soon.' }));
            setFormData({
                name: '',
                email: '',
                message: '',
            });
        }, 1000);
    };
    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('contact_us', { defaultValue: 'Liên Hệ Chúng Tôi' })}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_name', { defaultValue: 'Tên' })} *</label>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                                placeholder={t('contact_name_placeholder', { defaultValue: 'Tên của bạn' })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_email', { defaultValue: 'Email' })} *</label>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                                placeholder="info@hotel8bross.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_message', { defaultValue: 'Tin nhắn' })} *</label>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faComment}
                                className="absolute left-3 top-3 text-gray-400"
                            />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 resize-none"
                                placeholder={t('contact_message_placeholder', { defaultValue: 'Nhập tin nhắn vào đây...' })}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            } transition-colors duration-200`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {t('contact_sending', { defaultValue: 'Đang gửi...' })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <FontAwesomeIcon icon={faPaperPlane} />
                                {t('send', { defaultValue: 'Gửi' })}
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )

}
export default ContactUs