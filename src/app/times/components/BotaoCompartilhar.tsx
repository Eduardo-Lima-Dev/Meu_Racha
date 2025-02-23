import html2canvas from "html2canvas";

interface BotaoCompartilharProps {
  elementId: string;
}

const BotaoCompartilhar: React.FC<BotaoCompartilharProps> = ({ elementId }) => {
  const capturarImagem = async () => {
    const elemento = document.getElementById(elementId);
    if (!elemento) {
      alert("Erro ao capturar a divisão dos times.");
      return;
    }

    const originalDisplay = elemento.style.display;
    const originalGridTemplateColumns = elemento.style.gridTemplateColumns;
    const originalGap = elemento.style.gap;

    elemento.style.display = "grid";
    elemento.style.gridTemplateColumns = "repeat(4, 1fr)";
    elemento.style.gap = "10px";

    try {
      const canvas = await html2canvas(elemento, {
        backgroundColor: "white",
        scale: 4,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: elemento.scrollWidth,
        windowHeight: elemento.scrollHeight
      });

      elemento.style.display = originalDisplay;
      elemento.style.gridTemplateColumns = originalGridTemplateColumns;
      elemento.style.gap = originalGap;

      const dateStr = new Date().toLocaleString();
      const extraHeight = 100; 
      const sidePadding = 80; 

      const newCanvas = document.createElement("canvas");
      newCanvas.width = canvas.width + sidePadding * 2;
      newCanvas.height = canvas.height + extraHeight;
      const context = newCanvas.getContext("2d");
      if (context) {
  
        context.fillStyle = "white";
        context.fillRect(0, 0, newCanvas.width, newCanvas.height);

        context.fillStyle = "black";
        context.font = "60px Arial";
        context.textAlign = "center";
        context.fillText(dateStr, newCanvas.width / 2, 10 + 60);

        context.drawImage(canvas, sidePadding, extraHeight);
      }

      const imagem = newCanvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imagem;
      link.download = "divisao_times.png";
      link.click();
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      alert("Não foi possível gerar a imagem.");
    }
  };

  return (
    <button
      onClick={capturarImagem}
      className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4"
    >
      📸 Compartilhar Times
    </button>
  );
};

export default BotaoCompartilhar;
