import React, { useState, useEffect } from 'react';
import { Star, Heart, Award } from 'lucide-react';
import Header from '../../Components/componentUser/Header';
import Footer from '../../Common/Footer';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
    const [isVisible, setIsVisible] = useState({});
    const { t } = useTranslation();

    // Sử dụng key role để dịch
    const teamMembers = [
        {
            name: 'Trần Gia Bảo',
            role: 'ceo',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Với hơn 15 năm kinh nghiệm trong ngành khách sạn'
        },
        {
            name: 'Trần Đình Phúc Đức',
            role: 'manager',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên gia quản lý vận hành khách sạn'
        },
        {
            name: 'Nguyễn Hoàng Phước',
            role: 'chef',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên gia ẩm thực quốc tế'
        },
        {
            name: 'Đậu Minh Tuấn',
            role: 'sous_chef',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên về món Á - Âu'
        },
        {
            name: 'Phan Thành Long',
            role: 'pastry',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Nghệ nhân bánh ngọt hàng đầu'
        },
        {
            name: 'Nguyễn Hiếu Thịnh',
            role: 'fnb',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên gia dịch vụ ăn uống'
        },
        {
            name: 'Mai Trường Sơn',
            role: 'marketing',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên gia marketing hospitality'
        },
        {
            name: 'Nguyễn Trọng Quốc',
            role: 'it',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên gia công nghệ khách sạn'
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({
                            ...prev,
                            [entry.target.id]: true
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[id^="section-"]').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-white relative min-h-screen mt-20">
            <Header />
            <nav className="max-w-full mx-auto px-4 py-2 bg-gray-200 h-15 flex items-center mt-21 border-b">
                <ol className="flex items-center space-x-2 text-gray-600 font medium">
                    <li>
                        <Link to="/" className="hover:text-blue-600">{t('home')}</Link>
                    </li>
                    <li className="flex items-center">
                        <span className="mx-2">/</span>
                        <span className="text-blue-600 font-medium">{t('about_us')}</span>
                    </li>
                </ol>
            </nav>
            <section
                id="section-history"
                className="py-20 px-4 md:px-10 bg-gradient-to-b from-white to-gray-50"
            >
                <div className={`max-w-6xl mx-auto transform transition-all duration-1000 ${isVisible['section-history'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {t('about_history_title')}
                            </h2>
                            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                                <p>{t('about_history_1')}</p>
                                <p>{t('about_history_2')}</p>
                                <p>{t('about_history_3')}</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1000&auto=format&fit=crop"
                                    alt="Hotel History"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur-3xl opacity-20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section
                id="section-vision"
                className="py-20 px-4 md:px-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20" />
                <div className={`max-w-6xl mx-auto relative z-10 transform transition-all duration-1000 ${isVisible['section-vision'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            {t('about_vision_mission')}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">{t('about_vision')}</h3>
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {t('about_vision_content')}
                            </p>
                        </div>

                        <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">{t('about_mission')}</h3>
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {t('about_mission_content')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section
                id="section-team"
                className="py-20 px-4 md:px-10 bg-gradient-to-b from-gray-50 to-white"
            >
                <div className={`max-w-7xl mx-auto transform transition-all duration-1000 ${isVisible['section-team'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {t('about_team_title')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('about_team_desc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10">
                                    <div className="relative mb-6">
                                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Star className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-red-600 font-semibold mb-3">
                                            {t(`about_team_role_${member.role}`)}
                                        </p>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {member.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer className="bg-gray-900 text-white py-6 mt-20" />
        </div>
    );
};

export default AboutUs;