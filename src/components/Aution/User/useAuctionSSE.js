// hooks/useAuctionSSE.js
import { useEffect, useState } from 'react';

export const useAuctionSSE = (auctionId) => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    if (!auctionId) return;

    const source = new EventSource(`/v1/auctions/${auctionId}/stream`);

    source.onopen = () => {
      setConnectionStatus('connected');
      console.log('✅ Connected to auction stream');
    };

    source.onerror = () => {
      setConnectionStatus('error');
      console.log('❌ Connection error');
    };

    // Lắng nghe events
    source.addEventListener('new_participant', (event) => {
      const data = JSON.parse(event.data);
      setParticipants(data.total_participants);
    });

    source.addEventListener('new_bid', (event) => {
      const data = JSON.parse(event.data);
      setCurrentPrice(data.current_price);
    });

    source.addEventListener('auction_ended', (event) => {
      const data = JSON.parse(event.data);
      setIsEnded(true);
      setWinner(data.winner);
      source.close(); // Đóng kết nối
    });

    return () => source.close();
  }, [auctionId]);

  return { currentPrice, participants, isEnded, winner, connectionStatus };
};
