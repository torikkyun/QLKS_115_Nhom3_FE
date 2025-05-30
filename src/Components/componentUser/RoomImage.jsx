import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const RoomImageGallery = ({ 
  images, 
  room, 
  lightboxOpen, 
  lightboxIndex, 
  setLightboxOpen, 
  setLightboxIndex 
}) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-8">
          <img
            src={images[0].src}
            alt={room.soPhong}
            className="w-full h-96 object-cover rounded-lg shadow-sm cursor-pointer"
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          />
        </div>
        <div className="col-span-4 flex flex-col space-y-4">
          <img
            src={images[1].src}
            alt="Phòng view 1"
            className="w-full h-44 object-cover rounded-lg shadow-sm cursor-pointer"
            onClick={() => {
              setLightboxIndex(1);
              setLightboxOpen(true);
            }}
          />
          <img
            src={images[2].src}
            alt="Phòng view 2"
            className="w-full h-44 object-cover rounded-lg shadow-sm cursor-pointer"
            onClick={() => {
              setLightboxIndex(2);
              setLightboxOpen(true);
            }}
          />
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images}
        index={lightboxIndex}
      />
    </>
  );
};

export default RoomImageGallery;