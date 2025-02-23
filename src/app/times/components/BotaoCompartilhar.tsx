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

    // Ajusta o layout para que os times fiquem em grid com máximo 4 por linha
    const originalDisplay = elemento.style.display;
    const originalGridTemplateColumns = elemento.style.gridTemplateColumns;
    const originalGap = elemento.style.gap;

    elemento.style.display = "grid";
    elemento.style.gridTemplateColumns = "repeat(4, 1fr)";
    elemento.style.gap = "10px";

    try {
      // Utiliza scrollWidth e scrollHeight para capturar a área completa do elemento
      const canvas = await html2canvas(elemento, {
        backgroundColor: "white",
        scale: 3, // aumenta a resolução para uma imagem maior
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: elemento.scrollWidth,
        windowHeight: elemento.scrollHeight,
      });

      // Reverte os estilos originais do elemento
      elemento.style.display = originalDisplay;
      elemento.style.gridTemplateColumns = originalGridTemplateColumns;
      elemento.style.gap = originalGap;

      // Obter a data atual
      const dateStr = new Date().toLocaleString();
      const extraHeight = 150; // aumenta o espaço na parte superior
      const sidePadding = 80;  // aumenta o padding lateral

      // Cria um novo canvas com dimensões ampliadas
      const newCanvas = document.createElement("canvas");
      newCanvas.width = canvas.width + sidePadding * 2;
      newCanvas.height = canvas.height + extraHeight;
      const context = newCanvas.getContext("2d");
      if (context) {
        // Preenche o fundo com branco
        context.fillStyle = "white";
        context.fillRect(0, 0, newCanvas.width, newCanvas.height);

        // Desenha a data no topo (centralizada)
        context.fillStyle = "black";
        context.font = "60px Arial";
        context.textAlign = "center";
        context.fillText(dateStr, newCanvas.width / 2, 40);

        // Desenha a imagem capturada abaixo do espaço extra, com padding lateral
        context.drawImage(canvas, sidePadding, extraHeight);
      }

      newCanvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "divisao_times.png", { type: blob.type });
          // Compartilhamento via Web Share API (se suportado) com a imagem e texto
          if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
          ) {
            navigator
              .share({
                files: [file],
                title: "Divisão dos Times",
                text: "Confira a divisão de times criada em " + dateStr,
              })
              .catch((error) => {
                console.error("Erro ao compartilhar:", error);
                alert("Não foi possível compartilhar a imagem.");
              });
          } else {
            alert(
              "Seu dispositivo não suporta o compartilhamento de imagens via WhatsApp. Por favor, utilize um dispositivo compatível ou baixe a imagem para compartilhar manualmente."
            );
            const link = document.createElement("a");
            link.href = newCanvas.toDataURL("image/png");
            link.download = "divisao_times.png";
            link.click();
          }
        } else {
          alert("Erro ao gerar a imagem.");
        }
      });
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
