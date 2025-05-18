import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const getRoleClass = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-400";
    case "teacher":
      return "bg-blue-500";
    case "student":
      return "bg-amber-400";
    case "parent":
      return "bg-stone-400";
    default:
      return "bg-gray-300"; // Default color
  }
};

const Navbar = async () => {
  const user = await currentUser();
  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-600">
            {user?.firstName} {user?.lastName}{" "}
          </span>
          {typeof user?.publicMetadata?.role === "string" && (
            <span
              className={`px-2 py-1 rounded-xl text-[10px] text-white text-center ${getRoleClass(
                user.publicMetadata.role as string,
              )}`}
            >
              {user.publicMetadata.role}
            </span>
          )}
        </div>
        {/* <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/> */}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;