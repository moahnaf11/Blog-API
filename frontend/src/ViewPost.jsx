import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import commentIcon from "../public/comment.svg";

function ViewPost() {
  const location = useLocation();
  const [singlePost, setSinglePost] = useState({
    id: "",
    title: "",
    content: "",
    createdAt: "",
    author: {
      email: "",
    },
    comments: [],
  });
  const [isVisible, setIsVisible] = useState(false);
  const { post } = location.state || {};

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchPost() {
      try {
        const response = await fetch(`http://localhost:3000/posts/${post.id}`, {
          method: "GET",
          signal,
        });

        if (response.ok) {
          const post = await response.json();
          console.log(post);
          setSinglePost(post);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchPost();
    return () => {
      controller.abort();
    };
  }, []);

  function handleVisibility() {
    setIsVisible((prev) => !prev);
  }

  return (
    <main className="p-3 min-h-screen bg-gray-700 text-white">
      <div className="p-2 bg-white text-black rounded-md flex flex-col gap-3 shadow-md shadow-black">
        <h3 className="font-custom font-bold">{singlePost.title}</h3>
        <p className="flex-1">{singlePost.content}</p>
        <div className="flex items-center justify-between gap-5">
          <div>
            {singlePost.createdAt
              ? new Date(singlePost.createdAt).toLocaleDateString("en-GB")
              : null}
          </div>
          <div>
            {singlePost.createdAt
              ? new Date(singlePost.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="text-sm">{singlePost.author.email}</div>
          <button
            onClick={handleVisibility}
            className="flex gap-1 items-center"
          >
            <img className="size-6" src={commentIcon} alt="comment icon" />
            <span className="text-xs">{singlePost.comments.length}</span>
          </button>
        </div>
      </div>
      <section
        className={`mt-3 min-h-screen rounded-md  bg-white shadow-md shadow-black ${isVisible ? "" : "hidden"}`}
      >
        {singlePost.length > 0 &&
          singlePost.map((comment) => {
            <div key={comment.id}>
              <h3>{comment.user.email}</h3>
              <p>{comment.text}</p>
              <div>
                <div>
                  {new Date(comment.createdAt).toLocaleDateString("en-GB")}
                </div>
                <div>
                  {new Date(post.createdAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </div>
              </div>
            </div>;
          })}
      </section>
    </main>
  );
}

export { ViewPost };
