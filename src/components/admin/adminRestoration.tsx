import Image from "next/image";

export const AdminRestoration = () => {
  const handleClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const target = event.target as HTMLCanvasElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log(`Relative position: X: ${x}, Y: ${y}`);
  };

  return (
    <div style={{ width: "100%" }} className="flex justify-content-center">
      <Image
        src="https://cdn.jejusori.net/news/photo/202302/411949_420340_3735.png"
        alt="jejuisland"
        width="350"
        height="200"
        onClick={handleClick}
      />
    </div>
  );
};
