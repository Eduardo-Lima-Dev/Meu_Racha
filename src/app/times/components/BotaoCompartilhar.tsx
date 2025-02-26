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

    try {
      const canvas = await html2canvas(elemento, {
        backgroundColor: "white",
        scale: 2,
        useCORS: true,
        scrollX: 0, 
        scrollY: 0, 
        windowWidth: elemento.scrollWidth,
        windowHeight: elemento.scrollHeight
      });

      const imagem = canvas.toDataURL("image/png");

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
