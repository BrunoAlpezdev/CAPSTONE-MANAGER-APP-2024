"use client"

import Image from "next/image";

export default function Home() {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  }

  return (
    <main className="flex bg-gray-700 min-h-screen flex-col items-center justify-between p-24">
      <section className="flex border border-yellow-50 p-24 rounded-lg">

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <label htmlFor="">Usuario</label>
          <input type="email" />
          <label htmlFor="">Contraseña</label>
          <input type="password" />

          <button>Iniciar Sesión</button>

        </form>

      </section>
    </main>
  );
}
