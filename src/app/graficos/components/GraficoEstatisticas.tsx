'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

interface GraficoEstatisticasProps {
  nomeJogador: string;
  estatisticas: number[];
}

const GraficoEstatisticas: React.FC<GraficoEstatisticasProps> = ({ nomeJogador, estatisticas }) => {
  const refGrafico = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ? "dark" : "light";
    }
    return "light";
  });

  // 🚀 Atualiza o tema quando o usuário muda
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  useEffect(() => {
    if (refGrafico.current) {
      const grafico = echarts.init(refGrafico.current);

      const isDarkMode = theme === 'dark';

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
            color: isDarkMode ? '#ffffff' : '#000000', 
          },
        },
        legend: {
          data: ['Estatísticas'],
          bottom: 0,
          textStyle: {
            color: isDarkMode ? '#ffffff' : '#000000', 
          },
        },
        radar: {
          indicator: indicators.map((indicator) => ({
            name: `${indicator.name}\n(${indicator.value})`, 
            max: indicator.max,
            color: isDarkMode ? '#ffffff' : '#000000', 
          })),
          shape: 'polygon',
          axisName: {
            color: isDarkMode ? '#ffffff' : '#000000', 
          },
          splitLine: {
            lineStyle: {
              color: isDarkMode ? '#ffffff' : '#000000',
            },
          },
          splitArea: {
            areaStyle: {
              color: isDarkMode ? ['#1a1a1a', '#333333'] : ['#ffffff', '#f5f5f5'], 
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
              color: isDarkMode ? '#00BFFF' : '#0000FF', 
            },
            areaStyle: {
              color: isDarkMode ? 'rgba(0, 191, 255, 0.2)' : 'rgba(0, 0, 255, 0.1)',
            },
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: isDarkMode ? '#00BFFF' : '#0000FF',
            },
          },
        ],
        backgroundColor: 'transparent',
      };

      grafico.setOption(option);

      return () => grafico.dispose();
    }
  }, [nomeJogador, estatisticas, theme]);

  return <div ref={refGrafico} className="w-full h-[500px] bg-transparent" />;
};

export default GraficoEstatisticas;
