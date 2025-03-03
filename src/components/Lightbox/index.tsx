import Image, { StaticImageData } from "next/image";
import { useState } from "react";

interface LightboxProps {
  images: StaticImageData[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative w-full max-w-3xl">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          &times;
        </button>

        {/* Imagem do Carrossel */}
        <div className="flex justify-center">
          <Image
            src={images[currentIndex]}
            alt="Lightbox"
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>

        {/* Navegação do Carrossel */}
        <div
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl cursor-pointer"
          onClick={onPrev}
        >
          &#60;
        </div>
        <div
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl cursor-pointer"
          onClick={onNext}
        >
          &#62;
        </div>
      </div>
    </div>
  );
};


