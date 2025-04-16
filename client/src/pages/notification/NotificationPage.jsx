import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { baseURL } from "../../constants";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart, FaComment } from "react-icons/fa";
import { RiChat3Line } from "react-icons/ri";

const NotificationPage = () => {
  //to able to fetch notifications we need to add a query
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseURL}/api/notifications`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data; // Ensure it's always an array
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  //to able to delete notifications we need to add a mutation
  const { mutate: deleteNotifications, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${baseURL}/api/notifications`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button
                  onClick={deleteNotifications}
                  disabled={isPending}
                  className={`btn btn-error ${
                    isPending && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {isPending ? "Deleting..." : "Delete all notifications"}
                </button>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map(
          (notification) =>
            notification.from._id !== authUser?._id && (
              <div
                className="border-b border-gray-700 flex flex-col pb-2"
                key={notification._id}
              >
                <div className="flex gap-2 p-4 pb-1">
                  {notification.type === "follow" && (
                    <FaUser className="w-7 h-7 text-primary" />
                  )}
                  {notification.type === "like" && (
                    <FaHeart className="w-7 h-7 text-red-500" />
                  )}
                  {notification.type === "comment" && (
                    <RiChat3Line className="w-7 h-7 text-gray-300" />
                  )}
                  <Link to={`/profile/${notification.from.username}`}>
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={
                            notification.from.profileImg ||
                            "/avatar-placeholder.png"
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-bold">
                        @{notification.from.username}
                      </span>
                      {notification.type === "follow" && " followed you"}
                      {notification.type === "like" && " liked your post"}
                      {notification.type === "comment" && (
                        <>
                          <span> commented on your post</span>
                          <p className="text-sm text-gray-400 italic">
                            "{notification.content}"
                          </p>
                        </>
                      )}
                    </div>
                  </Link>
                </div>
                <span className="text-xs text-gray-500 pl-14">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            )
        )}
      </div>
    </>
  );
};

export default NotificationPage;
