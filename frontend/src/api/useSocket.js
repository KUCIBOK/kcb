// P3-PERF-003 — Hook React pour la connexion Socket.IO aux rooms d'enchères
//
// Utilisation :
//   useAuctionSocket(auctionId, {
//     onBidNew:       (data) => { /* { auctionId, bidId, amount, bidder, currentPrice, createdAt } */ },
//     onAuctionEnded: (data) => { /* { auctionId, winner } */ },
//     onAuctionStarted: (data) => { /* { auctionId } */ },
//   });
//
// En dev  : Vite proxy /socket.io → backend (vite.config.js ws:true)
// En prod : VITE_SOCKET_URL=https://backend.kucibok.com

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// URL du serveur Socket.IO :
//   - Dev  : VITE_SOCKET_URL non défini → window.location.origin (proxied by Vite)
//   - Prod : VITE_SOCKET_URL = https://backend.kucibok.com
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? window.location.origin;

export function useAuctionSocket(auctionId, handlers = {}) {
  // handlersRef évite de re-souscrire aux événements quand les callbacks changent de référence
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!auctionId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join:auction", auctionId);
    });

    socket.on("bid:new", (data) => {
      handlersRef.current.onBidNew?.(data);
    });

    socket.on("auction:ended", (data) => {
      handlersRef.current.onAuctionEnded?.(data);
    });

    socket.on("auction:started", (data) => {
      handlersRef.current.onAuctionStarted?.(data);
    });

    return () => {
      socket.emit("leave:auction", auctionId);
      socket.disconnect();
    };
  }, [auctionId]);
}
