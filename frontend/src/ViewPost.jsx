import { useRef, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import commentIcon from "/comment.svg";

function ViewPost() {
  const location = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const commentDialogRef = useRef(null);
  const { user } = useOutletContext();
  const [isVisible, setIsVisible] = useState(true);
  const { post } = location.state || {};
  const [comments, setComments] = useState(post.comments || []);
  const [currentComment, setCurrentComment] = useState({
    text: "",
  });
  const [newComment, setNewComment] = useState({
    text: "",
  });
  console.log("post", post);

  function handleVisibility() {
    setIsVisible((prev) => !prev);
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (isEdit) {
      setCurrentComment((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewComment((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClear = () => {
    setCurrentComment({
      text: "",
    });
  };

  const openDialog = () => {
    commentDialogRef.current.showModal();
    commentDialogRef.current.classList.add("show");
  };
  const closeDialog = () => {
    commentDialogRef.current.classList.remove("show");
    setTimeout(() => {
      commentDialogRef.current.close();
    }, 300);
  };

  async function handleDelete(id) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!isConfirmed) {
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/posts/${post.id}/comments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const deletedComment = await response.json();
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        );
        console.log("deleted comment", deletedComment);
      } else {
        console.log("Failed to delete the comment");
      }
    } catch (error) {
      console.error("Error deleting the comment", error);
    }
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    closeDialog();
    const token = localStorage.getItem("token");

    if (!isEdit) {
      const body = {
        ...newComment,
      };
      try {
        const response = await fetch(
          `http://localhost:3000/posts/${post.id}/comments`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (response.ok) {
          const comment = await response.json();
          console.log("comment created", comment);
          setComments((prev) => [...prev, comment]);
        }
      } catch (err) {
        console.log("Error creating new comment", err);
      }
    } else {
      // update comment
      const body = {
        ...currentComment,
      };
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:3000/posts/${post.id}/comments/${currentComment.id}`,
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
          const updatedComment = await response.json();
          console.log("updated comment", updatedComment);
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === currentComment.id ? updatedComment : comment
            )
          );
        } else {
          console.log("Failed to update the comment");
        }
      } catch (error) {
        console.error("Error updating the comment", error);
      }
    }
  };

  return (
    <main className="p-3 min-h-screen bg-gray-700 text-white relative">
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
            <span className="text-xs">{comments.length}</span>
          </button>
        </div>
      </div>

      {/* new comment dialog */}
      <dialog
        className="absolute min-w-[70%] rounded-lg"
        ref={commentDialogRef}
      >
        <form
          action="#"
          className="flex flex-col gap-4 p-3"
          onReset={handleClear}
          onSubmit={(e) => handleSubmitPost(e)}
        >
          <div className="flex justify-between items-center">
            <h2 className="font-custom font-bold mb-4">
              {isEdit ? "Update Comment" : "Create New Comment"}
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
            <label htmlFor="text">
              Text <span className="text-red-600">*</span>
            </label>
            <textarea
              className="border py-1 border-black px-1"
              type="text"
              name="text"
              id="text"
              placeholder="add comment"
              value={isEdit ? currentComment.text : newComment.text}
              onChange={(e) => handleChange(e)}
              required
            ></textarea>
          </div>

          <div className="flex gap-7">
            <button
              className="flex-1 text-xs sm:text-[16px] py-2 rounded-full font-bold font-custom hover:bg-white bg-green-600 border border-green-600"
              type="submit"
            >
              {isEdit ? "Update Comment" : "Add Comment"}
            </button>
            {isEdit ? (
              <button
                className="flex-1 text-xs sm:text-[16px] font-bold font-custom py-2 border bg bg-gray-500 border-gray-500 hover:bg-white rounded-full"
                type="reset"
              >
                Clear
              </button>
            ) : null}
          </div>
        </form>
      </dialog>
      <section
        className={`mt-3 min-h-min rounded-md text-black p-3 flex flex-col gap-7 bg-white shadow-md shadow-black ${isVisible ? "" : "hidden"}`}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-custom font-bold">Comments</h2>
          {user.id && (
            <button
              onClick={() => {
                setIsEdit(false);
                setNewComment({
                  text: "",
                });
                openDialog();
              }}
              className="py-2 px-3 rounded-full font-custom font-bold text-sm border border-black"
            >
              Add comment
            </button>
          )}
        </div>
        {comments.length > 0 &&
          comments.map((comment) => (
            <div key={comment.id}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm border-b-2 max-w-max">
                  {comment.user.email}
                </h3>
                {comment.user.id === user.id && (
                  <div className="flex items-center gap-4">
                    <button
                      className="hover:text-red-600"
                      onClick={() => handleDelete(comment.id)}
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
                        setCurrentComment(comment);
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
                )}
              </div>
              <p>{comment.text}</p>
              <div className="flex items-center justify-end gap-5 text-sm">
                <div className="text-xs">commented</div>
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

              {/* edited comment */}
              {comment.createdAt !== comment.updatedAt && (
                <div className="flex items-center justify-end gap-5 text-sm">
                  <div className="text-xs">edited</div>
                  <div>
                    {new Date(comment.updatedAt).toLocaleDateString("en-GB")}
                  </div>
                  <div>
                    {new Date(comment.updatedAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
      </section>
    </main>
  );
}

export { ViewPost };