import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, message, Divider } from 'antd';
import { PrinterOutlined, DownloadOutlined, HomeOutlined } from '@ant-design/icons';
import { getInvoiceById } from '../../apis/apiinvoice';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Header from '../../Components/componentUser/Header';
import Footer from '../../Common/Footer';

const InvoicePage = () => {
    const { t } = useTranslation();
    const { maDatPhong } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const data = await getInvoiceById(maDatPhong);
                setInvoice(data);
            } catch (error) {
                message.error(t('error_fetching_invoice', { defaultValue: 'Không thể tải thông tin hóa đơn: ' }) + error.message);
                navigate('/user/home');
            } finally {
                setLoading(false);
            }
        };
        if (maDatPhong) {
            fetchInvoice();
        }
    }, [maDatPhong, navigate, t]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        message.info(t('download_feature', { defaultValue: 'Tính năng tải xuống đang được phát triển' }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Spin size="large" />
                    <p className="mt-4">{t('loading_invoice', { defaultValue: 'Đang tải hóa đơn...' })}</p>
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center p-8">
                    <p className="text-lg mb-4">{t('no_invoice_found', { defaultValue: 'Không tìm thấy hóa đơn' })}</p>
                    <Button 
                        type="primary" 
                        onClick={() => navigate('/user/home')}
                        icon={<HomeOutlined />}
                    >
                        {t('back_to_home', { defaultValue: 'Quay Lại Trang Chủ' })}
                    </Button>
                </div>
            </div>
        );
    }

    const { datPhong, ngayXuatHoaDon, tongTien, tongTienPhong, tongTienDichVu, tinhTrangThanhToan, nhanVien } = invoice;

    return (
        <div className="min-h-screen bg-gray-100 ">
            <Header className="no-print" />
            
            <div className="py-10 px-10 mt-20 mb ">
                <div className="flex justify-between items-center mb-4 no-print ml-50 mr-50 mb-8">
                    <Button
                        onClick={() => navigate('/user/home')}
                        icon={<HomeOutlined />}
                    >
                        {t('back_to_home', { defaultValue: 'Quay Lại' })}
                    </Button>
                    
                    <div className="flex gap-2">
                        <Button
                            onClick={handlePrint}
                            icon={<PrinterOutlined />}
                        >
                            {t('print', { defaultValue: 'In Hóa Đơn' })}
                        </Button>
                        <Button
                            onClick={handleDownload}
                            icon={<DownloadOutlined />}
                            type="primary"
                        >
                            {t('download', { defaultValue: 'Tải xuống' })}
                        </Button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
                    {/* Header */}
                    <div className="text-center border-b-2 border-black pb-4 mb-6">
                        <h1 className="text-2xl font-bold mb-2">HÓA ĐƠN THANH TOÁN</h1>
                        <p className="text-base">KHÁCH SẠN</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                            <p className="font-semibold">Mã đặt phòng:</p>
                            <p>#{datPhong?.maDatPhong || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Ngày xuất:</p>
                            <p>{dayjs(ngayXuatHoaDon).format('DD/MM/YYYY HH:mm') || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Trạng thái:</p>
                            <p>{tinhTrangThanhToan?.tenTinhTrang || 'N/A'}</p>
                        </div>
                    </div>

                    <Divider />
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3">THÔNG TIN KHÁCH HÀNG</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><span className="font-semibold">Họ và tên:</span> {`${datPhong?.khachHang?.ho || ''} ${datPhong?.khachHang?.ten || ''}`.trim() || 'N/A'}</p>
                                <p><span className="font-semibold">Số điện thoại:</span> {datPhong?.khachHang?.sdt || 'N/A'}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Email:</span> {datPhong?.khachHang?.email || 'N/A'}</p>
                                <p><span className="font-semibold">CMND/CCCD:</span> {datPhong?.khachHang?.cccd || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <Divider />
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3">CHI TIẾT ĐẶT PHÒNG</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><span className="font-semibold">Số phòng đặt:</span> {datPhong?.soPhongDat || 'N/A'}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Ghi chú:</span> {datPhong?.ghiChu || 'Không có'}</p>
                            </div>
                        </div>
                    </div>

                    <Divider />
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3">CHI TIẾT THANH TOÁN</h2>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2 text-left">Mục</th>
                                    <th className="border border-gray-300 p-2 text-right">Số tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 p-2">Tổng tiền phòng</td>
                                    <td className="border border-gray-300 p-2 text-right">
                                        {tongTienPhong?.toLocaleString('vi-VN') || '0'} VND
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-2">Tổng tiền dịch vụ</td>
                                    <td className="border border-gray-300 p-2 text-right">
                                        {tongTienDichVu?.toLocaleString('vi-VN') || '0'} VND
                                    </td>
                                </tr>
                                <tr className="bg-gray-100 font-bold">
                                    <td className="border border-gray-300 p-2">TỔNG CỘNG</td>
                                    <td className="border border-gray-300 p-2 text-right">
                                        {tongTien?.toLocaleString('vi-VN') || '0'} VND
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {nhanVien && (
                        <div className="mb-6">
                            <p className="text-sm">
                                <span className="font-semibold">Nhân viên xử lý:</span> {nhanVien.hoTen || nhanVien.ten || 'N/A'}
                            </p>
                        </div>
                    )}

                    <div className="text-center mt-8 pt-4 border-t border-gray-300">
                        <p className="text-sm">Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
                        <p className="text-xs text-gray-600 mt-2">
                            Hóa đơn được in vào: {dayjs().format('DD/MM/YYYY HH:mm:ss')}
                        </p>
                    </div>
                </div>
            </div>
            
            <Footer />

            <style jsx>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    .print-container {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 20mm;
                        box-sizing: border-box;
                    }
                    
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default InvoicePage;