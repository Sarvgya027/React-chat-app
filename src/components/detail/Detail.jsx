import React from "react";
import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

function Detail() {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.uid);

    try {
      await updateDoc(userDocRef, {
        // Update the necessary fields here
        blocked: isReceiverBlocked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
      changeBlock()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy % help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowUp.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/23294313/pexels-photo-23294313/free-photo-of-an-aerial-view-of-a-small-house-with-a-red-light.jpeg"
                  alt=""
                />
                <span>photo_2024_2</span>
              </div>
              <img src="./download.png" alt="" />
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/23294313/pexels-photo-23294313/free-photo-of-an-aerial-view-of-a-small-house-with-a-red-light.jpeg"
                  alt=""
                />
                <span>photo_2024_2</span>
              </div>
              <img src="./download.png" alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button className="">{isCurrentUserBlocked ? "Unblock User" : "Block User"}</button>
        <button className="logout" onClick={() => auth.signOut()}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Detail;
