'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface GraficoEstatisticasProps {
  nomeJogador: string;
  estatisticas: number[];
}

const GraficoEstatisticas: React.FC<GraficoEstatisticasProps> = ({ nomeJogador, estatisticas }) => {
  const refGrafico = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refGrafico.current) {
      const grafico = echarts.init(refGrafico.current);

      const indicators = [
        { name: 'Físico', max: 10, value: estatisticas[0] },
        { name: 'Finalização', max: 10, value: estatisticas[1] },
        { name: 'Drible', max: 10, value: estatisticas[2] },
        { name: 'Defesa', max: 10, value: estatisticas[3] },
        { name: 'Passe', max: 10, value: estatisticas[4] },
      ];

      const option = {
        title: {
          text: nomeJogador,
          left: 'center',
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000000', 
          },
        },
        legend: {
          data: ['Estatísticas'],
          bottom: 0,
          textStyle: {
            color: '#000000', 
          },
        },
        radar: {
          indicator: indicators.map((indicator) => ({
            name: `${indicator.name}\n(${indicator.value})`, 
            max: indicator.max,
          })),
          shape: 'polygon',
          axisName: {
            color: '#000000', 
          },
          splitLine: {
            lineStyle: {
              color: '#000000',
            },
          },
          splitArea: {
            areaStyle: {
              color: ['#ffffff', '#f5f5f5'], 
            },
          },
        },
        series: [
          {
            name: 'Estatísticas do Jogador',
            type: 'radar',
            data: [
              {
                value: estatisticas,
                name: nomeJogador,
              },
            ],
            lineStyle: {
              color: '#0000FF', 
            },
            areaStyle: {
              color: 'rgba(0, 0, 255, 0.1)',
            },
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#0000FF',
            },
          },
        ],
      };

      grafico.setOption(option);

      return () => grafico.dispose();
    }
  }, [nomeJogador, estatisticas]);

  return <div ref={refGrafico} style={{ width: '100%', height: '500px' }} />;
};

export default GraficoEstatisticas;
