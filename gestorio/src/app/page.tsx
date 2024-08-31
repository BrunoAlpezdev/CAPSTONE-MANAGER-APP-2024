"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    router.push('/home')

  }

  return (
    <main className="fondo flex bg-Gris w-[100dvw] h-[100dvh] items-center justify-center p-24">
      <section className="flex flex-col border-2 bg-Gris border-Amarillo/60 shadow-lg px-12 py-16 rounded-lg">
        {/*
        TODO: REVISAR BG
         */}
        <div className="flex justify-center items-center mb-8">
          <Image
            priority
            src="/SAVANNALOGOpng.png"
            alt="Vercel Logo"
            width={500}
            height={100}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <label className="text-xl">Usuario</label>
          <input className="bg-Verde h-9 px-2 rounded-md" type="email" />

          <label className="text-xl">Contraseña</label>
          <input className="bg-Verde h-9 px-2 rounded-md" type="password"/>

          <button className="self-center text-2xl bg-Naranjo rounded-lg w-fit px-12 py-2 mt-8 transition hover:scale-105 hover:bg-Naranjo/90">
            Iniciar Sesión
          </button>

        </form>

      </section>
    </main>
  );
}
