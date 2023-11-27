import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';


const Header = () => {
  const { data: session } = useSession(); // Ensure you are using useSession hook correctly
  const [isMenuOpen, setMenuOpen] = useState(false);
  
  const handleToggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="z-50 sticky top-0 bg-gray-800 text-center p-5 text-white flex items-center justify-between">
      <button data-state="closed">
        <Link href="/home">
          <span className="text-2xl font-bold text-white">Form</span>
        </Link>
      </button>
      <p>Dashboard</p>
      <div className="flex flex-col items-center justify-end gap-4">
        <div className="text-center text-s text-black font-bold" >
          
          <div>
            <button
              type="button"
              id="profile-menu"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={handleToggleMenu}
            >
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                  className="aspect-square h-full w-full"
                  src={session?.user?.image ?? undefined} // Provide a fallback image URL
                  alt="Profile"
                />
              </span>
            </button>
            {isMenuOpen && session && session.user && (
              <div className="absolute top-15 right-0 bg-white p-2 rounded shadow-md">
                {/* Display user information */}
                <p>{session.user.name ?? 'Unknown'}</p>
                <p>{session.user.email ?? 'Unknown'}</p>

                {/* Sign-out button */}
                <button 
                onClick={handleSignOut}
                className="p-2 mb-2 rounded-full bg-gray-800 text-white border-2 border-black "
                >Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;