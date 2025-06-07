import React, { useState, useEffect } from 'react';
import { Star, Phone, Mail, MapPin, Heart, Award, Users, Calendar } from 'lucide-react';
import Header from '../../Components/componentUser/Header';
import Footer from '../../Common/Footer';

const AboutUs = () => {
    const [isVisible, setIsVisible] = useState({});
    
    const teamMembers = [
        {
            name: 'Trần Gia Bảo',
            role: 'Giám đốc điều hành',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Với hơn 15 năm kinh nghiệm trong ngành khách sạn'
        },
        {
            name: 'Trần Đình Phúc Đức',
            role: 'Quản lý khách sạn',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên gia quản lý vận hành khách sạn'
        },
        {
            name: 'Nguyễn Hoàng Phước',
            role: 'Đầu bếp trưởng',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên gia ẩm thực quốc tế'
        },
        {
            name: 'Đậu Minh Tuấn',
            role: 'Đầu bếp phó',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên về món Á - Âu'
        },
        {
            name: 'Phan Thành Long',
            role: 'Bếp trưởng bánh ngọt',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Nghệ nhân bánh ngọt hàng đầu'
        },
        {
            name: 'Nguyễn Hiếu Thịnh',
            role: 'Quản lý F&B',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên gia dịch vụ ăn uống'
        },
        {
            name: 'Mai Trường Sơn',
            role: 'Trưởng phòng Marketing',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/TrumpPortrait.jpg',
            description: 'Chuyên gia marketing hospitality'
        },
        {
            name: 'Nguyễn Trọng Quốc',
            role: 'Quản lý IT',
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
            <section 
                id="section-history" 
                className="py-20 px-4 md:px-10 bg-gradient-to-b from-white to-gray-50"
            >
                <div className={`max-w-6xl mx-auto transform transition-all duration-1000 ${
                    isVisible['section-history'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                    Lịch sử
                                </span>
                                <br />hình thành
                            </h2>
                            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                                <p>
                                    Khách sạn 8BROSS được thành lập vào năm 2010, bắt đầu từ một ý tưởng táo bạo: 
                                    tạo ra không gian nghỉ dưỡng hoàn hảo kết hợp giữa sang trọng hiện đại và nét đẹp truyền thống Việt Nam.
                                </p>
                                <p>
                                    Tọa lạc tại vị trí đắc địa trong trung tâm thành phố, chúng tôi đã không ngừng phát triển 
                                    từ một khách sạn boutique nhỏ thành thương hiệu hospitality được yêu thích hàng đầu.
                                </p>
                                <p>
                                    Với hơn 15 năm kinh nghiệm và cam kết không ngừng đổi mới, 8BROSS đã phục vụ 
                                    hàng nghìn du khách từ khắp nơi trên thế giới.
                                </p>
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
                <div className={`max-w-6xl mx-auto relative z-10 transform transition-all duration-1000 ${
                    isVisible['section-vision'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Tầm nhìn & <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">Sứ mệnh</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">Tầm nhìn</h3>
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Trở thành thương hiệu khách sạn hàng đầu Đông Nam Á, được công nhận về chất lượng dịch vụ đẳng cấp quốc tế, 
                                nơi mỗi khoảnh khắc của khách hàng đều trở thành kỷ niệm đáng nhớ.
                            </p>
                        </div>
                        
                        <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">Sứ mệnh</h3>
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Mang đến trải nghiệm nghỉ dưỡng hoàn hảo thông qua dịch vụ tận tâm, không gian sang trọng và 
                                sự chăm sóc chu đáo, biến mỗi chuyến đi thành hành trình khám phá đầy cảm hứng.
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
                <div className={`max-w-7xl mx-auto transform transition-all duration-1000 ${
                    isVisible['section-team'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Đội ngũ <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">chuyên nghiệp</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Những con người tài năng và tận tâm, luôn sẵn sàng mang đến trải nghiệm tuyệt vời nhất cho bạn
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
                                        <p className="text-red-600 font-semibold mb-3">{member.role}</p>
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
            <Footer className="bg-gray-900 text-white py-6 mt-20"/>
        </div>
    );
};

export default AboutUs;