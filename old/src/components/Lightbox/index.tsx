import Image, { StaticImageData } from "next/image";
import { useEffect } from "react";

interface LightboxProps {
  images: StaticImageData[]; // Mudado para string[] para lidar com URLs de imagem
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
  
  useEffect(() => {
    // Função para fechar a lightbox quando a tecla ESC for pressionada
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Adiciona o listener para o evento de pressionamento de tecla
    document.addEventListener("keydown", handleKeyDown);

    // Remove o listener quando o componente for desmontado ou fechado
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose}></div>
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
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl cursor-pointer bg-primary-blue"
          onClick={onPrev}
        >
          &#60;
        </div>
        <div
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl cursor-pointer bg-primary-blue"
          onClick={onNext}
        >
          &#62;
        </div>
      </div>
    </div>
  );
};
