import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Home() {
  const { user } = useOutletContext();
  console.log("user", user);

  return (
    <main className="p-3 min-h-screen bg-gray-700 text-white">
      {user.id ? <h2 className="font-custom font-bold">Welcome {user.firstName + " " + user.lastName}</h2> : null}

      <section className="min-h-screen p-3">
        <h2 className="font-custom font-bold">All Blogs</h2>
        <section className="min-h-screen bg-white grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] sm:sm:grid-cols-[repeat(3,_minmax(300px,_1fr))] gap-4 auto-rows-[300px]">
          <div></div>
          <div></div>
        </section>
      </section>
    </main>
  );
}

export { Home };
