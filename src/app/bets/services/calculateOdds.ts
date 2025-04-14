import { Jogador } from '../../dashboard/types';

export function calculateOdds(
  jogador: Jogador,
  betType: 'gols_feitos' | 'gols_sofridos'
): number {
  // Definindo pesos para os atributos (ajuste conforme sua lógica)
  const pesoGols = 2;
  const pesoAssist = 1.5;
  // Se houver atributo "estrelas", pode ser incluído; caso não, ignore
  const performanceScore = jogador.gols * pesoGols + jogador.assistencias * pesoAssist;
  
  if (betType === 'gols_feitos') {
    // Jogador com melhor desempenho tem chance maior de marcar, logo odds menores
    const odd = 3.0 - performanceScore / 100;
    return Math.max(1.2, Number(odd.toFixed(2)));
  } else {
    // Se apostar que ele sofrerá gols, melhor desempenho gera odds maiores, pois é menos provável sofrer
    const odd = 1.5 + performanceScore / 100;
    return Number(odd.toFixed(2));
  }
}
