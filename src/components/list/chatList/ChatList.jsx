import React, { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";

// 2:09:09
//real code has id and i used uid and it worked somehow
function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("")

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  console.log(chatId);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.uid),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.uid]);

  // this one is what claude gave me and it works but i dont see the chat array in console
  // useEffect(() => {
  //   let unSub;
  //   if (currentUser && currentUser.id) {
  //     unSub = onSnapshot(doc(db, "userchats", currentUser.id), (doc) => {
  //       console.log(doc.data());
  //       setChats(doc.data());
  //     });
  //   }
  //   return () => {
  //     if (unSub) {
  //       unSub();
  //     }
  //   };
  // }, [currentUser]);

  // console.log(chats);

  // const handleSelect = async (chat) => {
  //   const useChats = chats.map(item=> {
  //     const {user, ...rest} = item;
  //     return rest
  //   });

  //   const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

  //   userChats[chatIndex].isSeen = true;


  //   changeChat(chat.chatId, chat.user);
  //   const userChatsRef = doc(db, "userchats", currentUser.id);
  //   const userChatsSnapshot = await getDoc(userChatsRef);

  //   if (userChatsSnapshot.exists()) {
  //     const userChatsData = userChatsSnapshot.data();

  //     const chatIndex = userChatsData.chats.findInde(
  //       (c) => c.chatId === chatId
  //     );

  //     // userChatsData.chats[chatIndex].lastMessage = text;
  //     userChatsData.chats[chatIndex].isSeen = true;
  

  //     await updateDoc(userChatsRef, {
  //       chats: userChatsData.chats,
  //     });
  //   }
  // };
  // the above one is original


  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.uid);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  // const filteredChats = chats.filter((c) =>
  //   c.user.username.toLowerCase().includes(input.toLowerCase())
  // );
  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)} />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="plus"
          onClick={() => setAddMode(!addMode)}
        />
        {filteredChats.map((chat) => (
          <div
            className="item"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="" />
            <div className="texts">
              <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      {addMode && <AddUser />}
    </div>
  );
}

export default ChatList;
