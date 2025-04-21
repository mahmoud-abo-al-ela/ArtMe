import { FiMail, FiInfo, FiInstagram, FiFacebook } from "react-icons/fi";
import ProfileImage from "./ProfileImage";
import { FaEdit } from "react-icons/fa";

function ProfileView({ profile, onEditClick }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="p-8 flex flex-col items-center bg-gradient-to-b from-indigo-50 to-transparent">
          <div className="mb-6">
            <ProfileImage profile={profile} isEditing={false} />
          </div>

          <button
            onClick={onEditClick}
            className="w-full flex items-center justify-center px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="p-8 md:col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {profile?.name}
              </h2>
              <div className="flex items-center text-gray-500">
                <FiMail className="mr-2" />
                <p>{profile?.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <FiInfo className="mr-2" /> Bio
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-line">
                  {profile?.bio || "No bio provided yet."}
                </p>
              </div>
            </div>

            {profile?.social &&
              Object.values(profile?.social).some((link) => link) && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Social Links
                  </h3>
                  <div className="flex space-x-4">
                    {profile?.social?.instagram && (
                      <a
                        href={profile?.social?.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300"
                        title="Instagram"
                      >
                        <FiInstagram size={20} className="text-white" />
                      </a>
                    )}

                    {profile?.social?.facebook && (
                      <a
                        href={profile?.social?.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white hover:shadow-lg transition-all duration-300"
                        title="Facebook"
                      >
                        <FiFacebook size={20} className="text-white" />
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
