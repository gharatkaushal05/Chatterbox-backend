import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";

const allUsers = TryCatch(async(req, res)=> {
    const users = await User.find({});

    const transformedUsers = await Promise.all(
        users.map(
            async ({name, username, avatar, _id}) => {
                const [groups, friends] = await Promise.all([
                    Chat.countDocuments({groupChat: true, members: _id}),
                    Chat.countDocuments({groupChat: false, members: _id})
                ])
                return {
                    name,
                    username, 
                    avatar: avatar.url,
                    _id,
                    groups,
                    friends,
                }
            }
        )
    )

    return res.status(200).json({
        status: "success",
        users: transformedUsers,
    })
})

const allChats = TryCatch(async(req, res)=> {
    const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar")

    const transformedChats = await Promise.all(
        chats.map(async ({members, _id, groupChat, name, creator})=> {
            const totalMessages = await Message.countDocuments({chat: _id});

            return{
                _id, 
                groupChat,
                name, 
                avatar: members.slice(0,3).map((member)=> member.avatar.url),
                members: members.map(({_id, name, avatar})=> ({
                    _id, 
                    name,
                    avatar: avatar.url
                })),
                creator: {
                    name: creator?.name || "None",
                    avatar: creator?.avatar.url || ""
                },
                totalMembers: members.length,
                totalMessages

            }
        })
    )

    return res.status(200).json({
        status: "success",
        chats: transformedChats
    })

})

const allMessages = TryCatch(async (req, res)=> {
    const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat")

    const transformedMessages = messages.map(
        ({content, attachments, _id, sender, createdAt, chat}) => ({
            _id, 
            attachments,
            content,
            createdAt,
            chat: chat._id,
            groupChat: chat.groupChat,
            sender: {
                _id: sender._id,
                name: sender.name,
                avatar: sender.avatar.url,
            },

        })
    )

    return res.status(200).json({
        status: "success",
        messages: transformedMessages
    })

})

export {allUsers, allChats, allMessages}