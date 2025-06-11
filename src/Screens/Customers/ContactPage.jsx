import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone,
    faEnvelope,
    faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';

import Header from '../../Components/componentUser/Header';
import Footer from '../../Common/Footer';
import { Link } from 'react-router-dom';
import MapSelection from '../../Components/componentUser/MapSelection';
import ContactUs from '../../Components/componentUser/ContactUs';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
    const { t } = useTranslation();
    const contactInfo = [
        {
            icon: faPhone,
            title: t('contact_phone', { defaultValue: 'Điện thoại' }),
            detail: '+84 123 456 789',
            color: 'text-emerald-600',
            href: 'tel:+84 123 456 789',
        },
        {
            icon: faEnvelope,
            title: t('contact_email', { defaultValue: 'Email' }),
            detail: 'info@hotel8bross.com',
            color: 'text-blue-600',
            href: 'mailto:info@hotel8bross.com',
        },
        {
            icon: faMapMarkerAlt,
            title: t('contact_address', { defaultValue: 'Địa chỉ' }),
            detail: '10 Huỳnh Văn Nghệ, Bửu Long, Biên Hòa, Đồng Nai',
            color: 'text-rose-600',
            href: 'https://www.google.com/maps/@10.7955022,106.6838001,17z',
        },
    ];
    return (
        <div className="min-h-screen bg-gray-50">
            <Header className="transition-all duration-300 ease-in-out shadow-md " />
            <nav className="max-w-full mx-auto px-4 py-2 bg-gray-200 h-15 flex items-center mt-21 border-b">
                <ol className="flex items-center space-x-2 text-gray-600 font medium">
                    <li>
                        <Link to="/" className="hover:text-blue-600">{t('home')}</Link>
                    </li>
                    <li className="flex items-center">
                        <span className="mx-2">/</span>
                        <span className="text-blue-600 font-medium">{t('contact_us', { defaultValue: 'Liên hệ' })}</span>
                    </li>
                </ol>
            </nav>
            <div className=" text-blue-900 py-10 text-center">
                <div className="max-w-5xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">{t('contact_us', { defaultValue: 'LIÊN HỆ' })}</h1>
                    <p className="text-lg text-gray-600">{t('contact_subtitle', { defaultValue: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn!' })}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-5">
                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {contactInfo.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200 hover:bg-blue-100"
                        >
                            <div className={`${item.color} text-3xl mb-4 flex justify-center p-2 rounded-full w-12 h-12 mx-auto bg-gray-100`}>
                                <FontAwesomeIcon icon={item.icon} />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.detail}</p>
                        </a>
                    ))}
                </div>

                {/* Main Content: Form and Map */}
                <div className="grid lg:grid-cols-5 gap-6">
                    <ContactUs />
                    <MapSelection className="lg:col-span-3"/>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactPage;