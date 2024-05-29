import { Sparkles } from "lucide-react";

const RemoveBg = ({ handleRemoveBackground }) => {
  return (
    <div className="flex justify-between p-3 bg-gray-200 rounded-lg h-14">
      <div
        onClick={handleRemoveBackground}
        className="flex p-1 rounded-lg cursor-pointer"
      >
        <span className="pr-5 tracking-wider">
          Supprimer l'Arrière-Plan de l'Image
        </span>
        <Sparkles color={"#5c51c8"} size={"35"} />
      </div>
    </div>
  );
};

export default RemoveBg;
