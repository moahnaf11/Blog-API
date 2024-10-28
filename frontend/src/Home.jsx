import { useEffect, useState, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import commentIcon from "/comment.svg";
function Home() {
  const { user, displayPublished, setDisplayPublished } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({
    title: "",
    content: "",
    published: false,
  });
  const [newForm, setNewForm] = useState({
    title: "",
    content: "",
    published: false,
  });
  const [isEdit, setIsEdit] = useState(false);
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
  const closeDialog = () => {
    dialogRef.current.close();
  };

  // function to set dialog form fields
  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (isEdit) {
      setCurrentPost((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setNewForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Function to delete a post
  const deletePost = async (postId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!isConfirmed) {
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
    closeDialog();
    const token = localStorage.getItem("token");

    if (!isEdit) {
      const body = {
        ...newForm,
        published: newForm.published ? "true" : "false",
      };
      try {
        const response = await fetch(`http://localhost:3000/posts`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const post = await response.json();
          console.log("post created", post);
          setPosts((prev) => [...prev, post]);
        }
      } catch (err) {
        console.log("Error creating new post", err);
      }
    } else {
      // update post
      const body = {
        ...currentPost,
        published: currentPost.published ? "true" : "false",
      };
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:3000/posts/${currentPost.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (response.ok) {
          const updatedPost = await response.json();
          console.log("updated post", updatedPost);
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === currentPost.id ? updatedPost : post
            )
          );
        } else {
          console.log("Failed to update the post");
        }
      } catch (error) {
        console.error("Error updating the post", error);
      }
    }
  };

  const handleClear = () => {
    setCurrentPost({
      title: "",
      content: "",
      published: false,
    });
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
              onClick={() => {
                setIsEdit(false);
                setNewForm({
                  title: "",
                  content: "",
                  published: false,
                });
                openDialog();
              }}
              className="border shrink-0 hover:bg-white hover:text-black font-bold font-custom text-xs border-white px-1 py-2 sm:px-3 sm:text-[16px] rounded-full"
            >
              Create Post
            </button>
          ) : null}
        </div>
      ) : null}
      {/* new post dialog */}
      <dialog className="absolute min-w-[70%] rounded-lg" ref={dialogRef}>
        <form
          action="#"
          onSubmit={(e) => handleSubmitPost(e)}
          onReset={handleClear}
          className="flex flex-col gap-4 p-3"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-custom font-bold mb-4">
              {isEdit ? "Update Blog Post" : "Create New Blog Post"}
            </h2>
            <button
              type="button"
              onClick={closeDialog}
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
          </div>
          <div className="flex flex-col">
            <label htmlFor="title">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e) => handleChange(e)}
              className="border py-1 border-black px-1"
              type="text"
              name="title"
              id="title"
              placeholder="title"
              value={isEdit ? currentPost.title : newForm.title}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="content">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea
              onChange={(e) => handleChange(e)}
              className="border py-1 border-black px-1"
              name="content"
              id="content"
              value={isEdit ? currentPost.content : newForm.content}
              required
            ></textarea>
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="published">Do you want to publish?</label>
            <input
              className="w-5 h-5"
              type="checkbox"
              name="published"
              id="published"
              checked={isEdit ? currentPost.published : newForm.published}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flex gap-7">
            <button
              className="flex-1 py-2 rounded-full font-bold font-custom hover:bg-white bg-green-600 border border-green-600"
              type="submit"
            >
              {isEdit ? "Update Post" : "Add Post"}
            </button>
            {isEdit ? (
              <button
                className="flex-1 font-bold font-custom py-2 border bg bg-gray-500 border-gray-500 hover:bg-white rounded-full"
                type="reset"
              >
                Clear
              </button>
            ) : null}
          </div>
        </form>
      </dialog>

      <section className="min-h-screen p-3">
        <div className="flex mb-5 justify-between items-center">
          <h2 className="font-custom font-bold">All Blogs</h2>
          {user.id && (
            <button
              className="border px-3 py-2 rounded-full text-sm shrink-0 font-custom font-bold"
              onClick={() => setDisplayPublished((prev) => !prev)}
            >
              {displayPublished
                ? "View Unpublished Posts"
                : "View Published Posts"}
            </button>
          )}
        </div>
        <section className="min-h-screen grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:grid-cols-[repeat(2,_minmax(300px,_1fr))] lg:grid-cols-[repeat(3,_minmax(300px,_1fr))] gap-4 auto-rows-[300px]">
          {posts.length > 0 && displayPublished
            ? posts.map((post) =>
                post.published ? (
                  <div
                    key={post.id}
                    className="p-2 bg-white text-black rounded-md flex flex-col gap-3 shadow-md shadow-black"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-custom font-bold">{post.title}</h3>
                      {user.id === post.author.id ? (
                        <div className="flex gap-4 items-center">
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
                          <button
                            onClick={() => {
                              setIsEdit(true);
                              setCurrentPost(post);
                              openDialog();
                            }}
                          >
                            <svg
                              className="size-6 hover:text-green-700"
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
                                  d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                  stroke="currentColor"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                                <path
                                  d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                  stroke="currentColor"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                              </g>
                            </svg>
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <p className="flex-1">{post.content}</p>
                    <div className="flex flex-col">
                      <div className="text-xs">posted</div>
                      <div className="flex items-center justify-between gap-5">
                        <div>
                          {new Date(post.createdAt).toLocaleDateString("en-GB")}
                        </div>
                        <div>
                          {new Date(post.createdAt).toLocaleTimeString(
                            "en-GB",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    {/* edited at timestamp */}

                    {post.createdAt !== post.updatedAt && (
                      <div className="flex flex-col">
                        <div className="text-xs">edited</div>
                        <div className="flex items-center justify-between gap-5">
                          <div>
                            {new Date(post.updatedAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </div>
                          <div>
                            {new Date(post.updatedAt).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
              )
            : posts
                .filter((post) => !post.published && user.id === post.author.id)
                .map((post) => (
                  <div
                    key={post.id}
                    className="p-2 bg-white text-black rounded-md flex flex-col gap-3 shadow-md shadow-black"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-custom font-bold">{post.title}</h3>
                      {user.id === post.author.id ? (
                        <div className="flex gap-4 items-center">
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
                          <button
                            onClick={() => {
                              setIsEdit(true);
                              setCurrentPost(post);
                              openDialog();
                            }}
                          >
                            <svg
                              className="size-6 hover:text-green-700"
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
                                  d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                  stroke="currentColor"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                                <path
                                  d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                  stroke="currentColor"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                              </g>
                            </svg>
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <p className="flex-1">{post.content}</p>
                    <div className="flex flex-col">
                      <div className="text-xs">posted</div>
                      <div className="flex items-center justify-between gap-5">
                        <div>
                          {new Date(post.createdAt).toLocaleDateString("en-GB")}
                        </div>
                        <div>
                          {new Date(post.createdAt).toLocaleTimeString(
                            "en-GB",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    {/* edited at timestamp */}

                    {post.createdAt !== post.updatedAt && (
                      <div className="flex flex-col">
                        <div className="text-xs">edited</div>
                        <div className="flex items-center justify-between gap-5">
                          <div>
                            {new Date(post.updatedAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </div>
                          <div>
                            {new Date(post.updatedAt).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
                ))}
        </section>
      </section>
    </main>
  );
}

export { Home };
