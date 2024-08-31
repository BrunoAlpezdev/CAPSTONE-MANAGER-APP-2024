"use client"

import Image from "next/image";

export default function Home() {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  }

  return (
    <main className="flex bg-Gris h-[100dvh] items-center justify-center p-24">
      <section className="flex flex-col border bg-Gris border-Amarillo shadow-lg p-24 rounded-lg">
        <div className="flex justify-center items-center mb-8">
          <Image
            src="/SAVANNALOGOpng.png"
            alt="Vercel Logo"
            width={500}
            height={100}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <label >Usuario</label>
          <input type="email" />
          <label >Contraseña</label>
          <input type="password" className=""/>

          <button className="self-center text-2xl bg-Naranjo rounded-lg w-fit px-12 py-2">
            Iniciar Sesión
          </button>

        </form>

      </section>
    </main>
  );
}
