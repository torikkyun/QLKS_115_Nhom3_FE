import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMapMarkerAlt,} from "@fortawesome/free-solid-svg-icons";
import { Frown } from "lucide-react";
const MapSelection = () => {
    return (
        <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Địa Chỉ Chúng Tôi</h2>
                <div className="w-full">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15668.439028986038!2d106.79179584558656!3d10.955081105805727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d95970202f3f%3A0x679e7fa6d33f74e5!2zVHLGsOG7nW5nIMSR4bqhaSBo4buNYyBM4bqhYyBI4buTbmc!5e0!3m2!1svi!2s!4v1749531806383!5m2!1svi!2s"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-md"
                    ></iframe>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700 text-sm">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-rose-600 mr-2" />
                        10 Huỳnh Văn Nghệ, Bửu Long, Biên Hòa, Đồng Nai Province, Vietnam
                    </p>
                </div>
            </div>
        </div>
    );
}
export default MapSelection