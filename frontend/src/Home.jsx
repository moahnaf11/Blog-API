import { useEffect, useState, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import commentIcon from "/comment.svg";
function Home() {
  const { user } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const dialogRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchPosts() {
      try {
        const response = await fetch("http://localhost:3000/posts", {
          method: "GET",
          signal,
        });

        if (response.ok) {
          const posts = await response.json();
          console.log(posts);
          setPosts(posts);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchPosts();
    return () => {
      controller.abort();
    };
  }, []);

  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();

  // Function to delete a post
  const deletePost = async (postId) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal,
      });

      if (response.ok) {
        // Filter out the deleted post from the state
        const deletedPost = await response.json();
        console.log("deleted post", deletedPost);
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        console.log("Failed to delete the post");
      }
    } catch (error) {
      console.error("Error deleting the post", error);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    const signal = controller.signal;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal,
      });
    } catch (err) {
      console.log("Error creating new post", err);
    }
  };

  return (
    <main className="p-3 min-h-screen bg-gray-700 text-white relative">
      {user.id ? (
        <div className="flex justify-between items-center gap-3">
          <h2 className="font-custom font-bold">
            Welcome {user.firstName + " " + user.lastName}
          </h2>
          {user.role === "AUTHOR" ? (
            <button
              onClick={openDialog}
              className="border shrink-0 hover:bg-white hover:text-black font-bold font-custom text-xs border-white px-1 py-2 sm:px-3 sm:text-[16px] rounded-full"
            >
              Create Post
            </button>
          ) : null}
        </div>
      ) : null}

      <dialog className="absolute min-w-[70%] rounded-lg" ref={dialogRef}>
        <form action="" className="flex flex-col gap-4 p-3">
          <div className="flex justify-between items-center">
            <h2 className="font-custom font-bold mb-4">Create New Blog Post</h2>
            <button onClick={closeDialog} className="hover:text-red-600">
              <svg
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </button>
          </div>
          <div className="flex flex-col">
            <label htmlFor="title">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              className="border py-1 border-black px-1"
              type="text"
              name="title"
              id="title"
              placeholder="title"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="content">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea className="border py-1 border-black px-1" name="content" id="content"></textarea>
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="published">Do you want to publish?</label>
            <input className="w-5 h-5" type="checkbox" name="published" id="published" />
          </div>

          <div className="flex">
            <button className="flex-1 py-2 rounded-full font-bold font-custom hover:bg-white bg-green-600 border border-green-600" onClick={(e) => handleSubmitPost(e)} type="submit">
              Add Post
            </button>
          </div>
        </form>
      </dialog>

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
                  <div className="flex justify-between items-center">
                    <h3 className="font-custom font-bold">{post.title}</h3>
                    {user.id === post.author.id ? (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="hover:text-red-600"
                      >
                        <svg
                          className="size-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>{" "}
                          </g>
                        </svg>
                      </button>
                    ) : null}
                  </div>
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
