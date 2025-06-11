import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message, Card, Typography, Space } from 'antd';
import { SearchOutlined, HomeOutlined, FileTextOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getInvoiceByIdPublic } from '../../apis/apiinvoice';
import Header from '../../Components/componentUser/Header';
import Footer from '../../Common/Footer';

const { Title, Text } = Typography;

const InvoiceSearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (values) => {
    try {
      setLoading(true);
      const { maDatPhong } = values;
      await getInvoiceByIdPublic(maDatPhong);
      navigate(`/user/invoice/${maDatPhong}`);
    } catch (error) {
      message.error(t('no_invoice_found', { defaultValue: 'Không tìm thấy hóa đơn với mã đặt phòng này. Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 overflow-hidden mt-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'3.5\' cy=\'3.5\' r=\'3.5\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] motion-reduce:animate-none animate-pulse"></div>
        
        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <FileTextOutlined className="text-5xl sm:text-6xl mb-6 block mx-auto opacity-90 motion-reduce:animate-none animate-bounce" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 text-transparent bg-clip-text">
              {t('invoice_lookup', { defaultValue: 'Tra cứu hóa đơn' })}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              {t('invoice_lookup_description', { 
                defaultValue: 'Nhập mã đặt phòng để tra cứu và xem chi tiết hóa đơn của bạn một cách nhanh chóng và tiện lợi' 
              })}
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          {/* Search Card */}
          <Card className="mb-8 shadow-lg border-0 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                  <SearchOutlined className="text-xl sm:text-2xl text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {t('search_invoice', { defaultValue: 'Tra cứu hóa đơn' })}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {t('enter_booking_code', { defaultValue: 'Vui lòng nhập mã đặt phòng để tìm kiếm' })}
                </p>
              </div>
              
              <Form 
                form={form} 
                onFinish={handleSearch} 
                layout="vertical"
                className="space-y-6"
              >
                <Form.Item
                  name="maDatPhong"
                  label={
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      {t('booking_id', { defaultValue: 'Mã đặt phòng' })}
                    </span>
                  }
                  rules={[
                    { required: true, message: t('booking_id_required', { defaultValue: 'Vui lòng nhập mã đặt phòng' }) },
                    { pattern: /^[0-9]+$/, message: t('booking_id_invalid', { defaultValue: 'Mã đặt phòng phải là số' }) },
                  ]}
                >
                  <Input 
                    size="large"
                    placeholder={t('booking_id_placeholder', { defaultValue: 'Mã đặt phòng' })}
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="h-12 sm:h-14 rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-200"
                  />
                </Form.Item>
                
                <div className="space-y-3">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    block 
                    loading={loading}
                    icon={<SearchOutlined />}
                    className="h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {loading ? 
                      t('searching', { defaultValue: 'Đang tìm kiếm...' }) : 
                      t('search_now', { defaultValue: 'Tìm kiếm ngay' })
                    }
                  </Button>
                  
                  <Button
                    size="large"
                    block
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/user/home')}
                    className="h-12 sm:h-14 border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 rounded-xl font-semibold text-gray-700 transition-all duration-200"
                  >
                    {t('back_to_home', { defaultValue: 'Quay lại trang chủ' })}
                  </Button>
                </div>
              </Form>
            </div>
          </Card>

          {/* Help Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl shadow-lg">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <FileTextOutlined className="text-xl text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('need_help', { defaultValue: 'Cần hỗ trợ?' })}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {t('help_description', { 
                  defaultValue: 'Mã đặt phòng là dãy số bạn nhận được qua email sau khi đặt phòng thành công. Nếu không tìm thấy, vui lòng kiểm tra hộp thư spam hoặc liên hệ bộ phận hỗ trợ.' 
                })}
              </p>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-600 font-medium">
                  📞 Hotline: 1900-8888 | ✉️ info@hotel8bross.com
                </p>
              </div>
            </div>
          </Card>

        </div>
      </div>
      
      <Footer className="bg-white border-t border-gray-200 shadow-lg" />
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-25%); }
          50% { transform: none; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default InvoiceSearchPage;