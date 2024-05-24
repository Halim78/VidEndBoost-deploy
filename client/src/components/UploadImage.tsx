import { useRef, useState } from "react";
import { ImageUp } from "lucide-react";

const UploadImage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setSelectedImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-between p-3 bg-gray-200 rounded-lg h-14">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <div
        onClick={triggerFileInput}
        className="flex p-1 rounded-lg cursor-pointer"
      >
        <span className="pr-5 tracking-wider">
          Téléverse une image pour ta vignette
        </span>
        <ImageUp color={"#e580d8"} size={"35"} />
      </div>
      {selectedImage && (
        <img
          src={selectedImage}
          alt="Uploaded"
          className="object-cover w-64 h-64 rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default UploadImage;
