import { useEffect, useState } from "react";
import Image from "next/image";
import { LuSearch } from "react-icons/lu";
import { ConversationListProps } from "@/types/props/conversation.props";
import { ConversationListResponseType } from "@/types/types/response.types";
import { ConversationDisplayType } from "@/types/types/conversation.types";
import { LoggedInUserType } from "@/types/types/auth.types";
import { useAppStore } from "@/store/store";
import { getConversationDisplay } from "@/utils/conversation.utils";
import { fetchConversationsList } from "@/lib/actions/conversation.action";
import { conversationRoutes } from "@/lib/routes/routes";
import FormInput from "@/components/forms/shared/form.input";

const ConversationList = ({
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  const [conversationList, setConversationList] = useState<
    ConversationDisplayType[]
  >([]);

  const loggedInUser = useAppStore((state) => state.loggedInUser);

  const getConversationList = async (loggedInUser: LoggedInUserType) => {
    const fetchConversationsListResponse = await fetchConversationsList();

    if (
      fetchConversationsListResponse.success &&
      fetchConversationsListResponse?.data
    ) {
      const data =
        fetchConversationsListResponse?.data as ConversationListResponseType;

      setConversationList(
        data.conversations.map((conversation) =>
          getConversationDisplay(conversation, loggedInUser),
        ),
      );
    } else {
      setConversationList([]);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      getConversationList(loggedInUser);
    }
  }, [loggedInUser]);

  return (
    <div className="flex flex-col bg-surface md:bg-transparent border-glass-border md:border-r w-full md:w-72 lg:w-80 h-full shrink-0">
      <div className="bg-glass-bg p-4 pb-2 border-glass-border border-b">
        <h4 className="mb-2 font-arima tracking-wider">Messages</h4>
        <div className="relative flex-1 max-w-md">
          <FormInput
            placeholder="Search messages..."
            startIcon={<LuSearch />}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversationList.length > 0 ? (
          conversationList.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                if (window) {
                  window.history.pushState(
                    {},
                    "",
                    conversationRoutes.conversation,
                  );
                }

                onSelectConversation(conversation.conversation);
              }}
              className={`w-full text-left p-3 flex gap-2 items-center border-b border-glass-border duration-200 hover:bg-glass-bg-subtle ${selectedConversationId === conversation.id ? "bg-glass-bg-strong" : "bg-glass-bg"}`}
            >
              <div className="relative shrink-0">
                <Image
                  src={conversation.avatar}
                  alt={conversation.title}
                  width={100}
                  height={100}
                  className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
                />
                {conversation.isOnline ? (
                  <span className="right-0 bottom-0 absolute bg-green-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
                ) : (
                  <span className="right-0 bottom-0 absolute bg-gray-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h6 className="font-medium text-text-primary truncate">
                    {conversation.title}
                  </h6>
                  <span className="ml-2 text-text-secondary text-xs shrink-0">
                    {conversation.lastActivity}
                  </span>
                </div>
                <p className="font-light text-text-secondary text-sm truncate">
                  {conversation.subtitle}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="flex justify-center items-center bg-status-info-bg border border-status-info-border rounded-full w-5 h-5 shrink-0">
                  <span className="font-bold text-[10px] text-status-info-text">
                    {conversation.unreadCount}
                  </span>
                </div>
              )}
            </button>
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="my-auto text-sm text-center">
              No conversation available yet...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
