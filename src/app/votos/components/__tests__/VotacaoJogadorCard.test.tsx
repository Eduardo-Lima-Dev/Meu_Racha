import React from 'react';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import VotacaoJogadorCard from '../VotacaoJogadorCard';

const jogador = {
  id: '1',
  nome: 'Jogador 1',
  assistencias: 5,
  gols: 10,
  votos: [],
  excluirDaVotacao: false,
};

const handleVoteChange = jest.fn();

describe('VotacaoJogadorCard', () => {
  test('renders jogador information', () => {
    render(<VotacaoJogadorCard jogador={jogador} handleVoteChange={handleVoteChange} />);

    expect(screen.getByText('Jogador 1')).toBeInTheDocument();
    expect(screen.getByText('Assistências: 5 | Gols: 10')).toBeInTheDocument();
  });

  test('calls handleVoteChange when a vote is selected', () => {
    render(<VotacaoJogadorCard jogador={jogador} handleVoteChange={handleVoteChange} />);

    const radio = screen.getByLabelText('3 Estrelas');
    fireEvent.click(radio);

    expect(handleVoteChange).toHaveBeenCalledWith('1', 3);
  });
});
