import { UserButton } from "@clerk/nextjs";
import { FaBullhorn, FaEnvelope, FaSearch } from "react-icons/fa"; // Importing icons
import userImage from "../assets/user.jpg"; // Correctly import the user image
import { currentUser } from "@clerk/nextjs/server";

const Navbar = async () => {
  const user = await currentUser();
  // Sample user data
  const users = {
    name: "Son Goku",
    role: "Admin",
    image: userImage, // Use the imported image here
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white">
      {/* Left side: Search Bar */}
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md">
          {/* Adjusted for responsive width */}
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primaryLight" // Changed to orange outline
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Right side: Icons and User Details */}
      <div className="flex items-center gap-4 relative">
        {/* Announcement Icon with Notification Count */}
        <div className="relative">
          <FaBullhorn className="text-gray-400 cursor-pointer" size={20} />
          {/* Notification Count */}
          <div className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            1
          </div>
        </div>
        {/* Messages Icon */}
        <FaEnvelope className="text-gray-400 cursor-pointer" size={20} />
        {/* User Details */}
        <div className="hidden md:flex flex-col">
          {/* Show on medium screens and up */}
          <span className="font-semibold text-sm">{users.name}</span>
          <span className="text-xs text-gray-500 capitalize">
            {user?.publicMetadata.role as string}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
