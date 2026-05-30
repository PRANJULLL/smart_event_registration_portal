import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileSuccess, updateAvatarSuccess } from '../store/authSlice';
import api from '../utils/api';
import { User, Mail, Lock, Camera, Loader, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return `${import.meta.env.VITE_IMAGE_BASE_URL}/${user.avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff`;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error('Name and Email are required');
    }

    if (password && password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setLoading(true);
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      const response = await api.put('/auth/profile', updateData);
      if (response.data.success) {
        dispatch(updateProfileSuccess(response.data));
        toast.success('Profile updated successfully');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      return toast.error('Only image files are allowed');
    }

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      const response = await api.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        dispatch(updateAvatarSuccess(response.data.avatar));
        toast.success('Avatar uploaded successfully');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upload avatar';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-[85vh] py-12 transition-colors duration-300">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-150 dark:border-slate-700/50 p-8 space-y-8">
          
          {/* Section Header */}
          <div className="text-center">
            <h1 className="text-2xl font-extrabold dark:text-white">Edit Profile</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update your account credentials and avatar</p>
          </div>

          {/* Avatar Edit Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={getAvatarUrl()}
                alt={user?.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-md transition-all duration-300 group-hover:brightness-90"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-full cursor-pointer shadow-md transition-colors"
                title="Upload Photo"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              
              {uploading && (
                <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center">
                  <Loader className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-3">Allowed: PNG, JPG, JPEG, GIF. Max 5MB.</p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-750 dark:text-slate-300">Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-750 dark:text-slate-300">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-755 dark:text-slate-300">
                  New Password (leave blank to keep current)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              {password && (
                <div>
                  <label className="block text-sm font-semibold text-slate-755 dark:text-slate-300">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required={!!password}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-650 hover:bg-indigo-755 disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile Changes
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Profile;
