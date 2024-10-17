import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import commentIcon from "../public/comment.svg";
function Home() {
  const { user } = useOutletContext();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchPosts() {
      const response = await fetch("http://localhost:3000/posts", {
        method: "GET",
        signal,
      });

      if (response.ok) {
        const posts = await response.json();
        console.log(posts);
        setPosts(posts);
      }
    }
    fetchPosts();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="p-3 min-h-screen bg-gray-700 text-white">
      {user.id ? (
        <h2 className="font-custom font-bold">
          Welcome {user.firstName + " " + user.lastName}
        </h2>
      ) : null}

      <section className="min-h-screen p-3">
        <h2 className="font-custom font-bold mb-5">All Blogs</h2>
        <section className="min-h-screen grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:grid-cols-[repeat(2,_minmax(300px,_1fr))] lg:grid-cols-[repeat(3,_minmax(300px,_1fr))] gap-4 auto-rows-[300px]">
          {posts.length > 0 &&
            posts.map((post) =>
              post.published ? (
                <div
                  key={post.id}
                  className="p-2 bg-white text-black rounded-md flex flex-col gap-3 shadow-md shadow-black"
                >
                  <h3 className="font-custom font-bold">{post.title}</h3>
                  <p className="flex-1">{post.content}</p>
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      {new Date(post.createdAt).toLocaleDateString("en-GB")}
                    </div>
                    <div>
                      {new Date(post.createdAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-5">
                    <div className="text-sm">{post.author.email}</div>
                    <Link
                      className="flex gap-1 items-center"
                      to="/post"
                      state={{ post }}
                    >
                      <img
                        className="size-6"
                        src={commentIcon}
                        alt="comment icon"
                      />
                      <span className="text-xs">{post.comments.length}</span>
                    </Link>
                  </div>
                </div>
              ) : null
            )}
        </section>
      </section>
    </main>
  );
}

export { Home };
