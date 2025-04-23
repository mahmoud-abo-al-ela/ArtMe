import { FiMail, FiInfo, FiInstagram, FiFacebook } from "react-icons/fi";
import ProfileImage from "./ProfileImage";
import { FaEdit } from "react-icons/fa";

function ProfileView({ profile, onEditClick }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center bg-gradient-to-b from-indigo-50 to-transparent">
          <div className="mb-4 sm:mb-6">
            <ProfileImage profile={profile} isEditing={false} />
          </div>

          <button
            onClick={onEditClick}
            className="w-full flex items-center justify-center px-4 py-2 sm:px-5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow text-sm sm:text-base"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8 md:col-span-2">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                {profile?.name}
              </h2>
              <div className="flex items-center text-gray-500 text-sm sm:text-base">
                <FiMail className="mr-2" />
                <p className="truncate">{profile?.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <FiInfo className="mr-2" /> Bio
              </h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-line text-sm sm:text-base">
                  {profile?.bio || "No bio provided yet."}
                </p>
              </div>
            </div>

            {profile?.social &&
              Object.values(profile?.social).some((link) => link) && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-600 mb-2 sm:mb-3">
                    Social Links
                  </h3>
                  <div className="flex space-x-3 sm:space-x-4">
                    {profile?.social?.instagram && (
                      <a
                        href={profile?.social?.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300"
                        title="Instagram"
                      >
                        <FiInstagram
                          size={18}
                          className="text-white sm:text-xl"
                        />
                      </a>
                    )}

                    {profile?.social?.facebook && (
                      <a
                        href={profile?.social?.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-600 text-white hover:shadow-lg transition-all duration-300"
                        title="Facebook"
                      >
                        <FiFacebook
                          size={18}
                          className="text-white sm:text-xl"
                        />
                      </a>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
