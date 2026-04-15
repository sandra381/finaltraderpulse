// src/app/page.tsx
import React from 'react';
import Dashboard from './dashboard/page'; // Si el dashboard está en /dashboard
// O si moviste todo a la raíz, simplemente exporta el componente principal

export default function Home() {
  return <Dashboard />;
}
