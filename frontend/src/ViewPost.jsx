import { useState } from "react";
import { useLocation } from "react-router-dom";
import commentIcon from "/comment.svg";

function ViewPost() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const { post } = location.state || {};
  console.log("post", post);

  function handleVisibility() {
    setIsVisible((prev) => !prev);
  }

  return (
    <main className="p-3 min-h-screen bg-gray-700 text-white">
      <div className="p-2 bg-white text-black rounded-md flex flex-col gap-3 shadow-md shadow-black">
        <h3 className="font-custom font-bold">{post.title}</h3>
        <p className="flex-1">{post.content}</p>
        <div className="flex items-center justify-between gap-5">
          <div>
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("en-GB")
              : null}
          </div>
          <div>
            {post.createdAt
              ? new Date(post.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="text-sm">{post.author.email}</div>
          <button
            onClick={handleVisibility}
            className="flex gap-1 items-center"
          >
            <img className="size-6" src={commentIcon} alt="comment icon" />
            <span className="text-xs">{post.comments.length}</span>
          </button>
        </div>
      </div>
      <section
        className={`mt-3 min-h-min rounded-md text-black p-3 flex flex-col gap-5 bg-white shadow-md shadow-black ${isVisible ? "" : "hidden"}`}
      >
        <h2 className="font-custom font-bold">Comments</h2>
        {post.comments.length > 0 &&
          post.comments.map((comment) => (
            <div key={comment.id}>
              <h3 className="text-sm border-b-2 max-w-max">{comment.user.email}</h3>
              <p>{comment.text}</p>
              <div className="flex items-center justify-end gap-5 text-sm">
                <div>
                  {new Date(comment.createdAt).toLocaleDateString("en-GB")}
                </div>
                <div>
                  {new Date(comment.createdAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </div>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}

export { ViewPost };
