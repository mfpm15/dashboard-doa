'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { communityManager, SharedPrayer, InspirationPost, UserProfile } from '@/lib/community/sharing';
import { Item } from '@/types';

interface CommunityDashboardProps {
  items: Item[];
  onItemSelect?: (item: Item) => void;
  className?: string;
}

export function CommunityDashboard({ items, onItemSelect, className = "" }: CommunityDashboardProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'prayers' | 'inspirations' | 'profile'>('feed');
  const [sharedPrayers, setSharedPrayers] = useState<SharedPrayer[]>([]);
  const [inspirationPosts, setInspirationPosts] = useState<InspirationPost[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Item | null>(null);
  const [showInspirationModal, setShowInspirationModal] = useState(false);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = () => {
    setSharedPrayers(communityManager.getSharedPrayers({ limit: 20 }));
    setInspirationPosts(communityManager.getInspirationPosts({ limit: 20 }));
    setUserProfile(communityManager.getCurrentUser());
    setTrendingTags(communityManager.getTrendingTags(8));
  };

  const handleSharePrayer = async (prayer: Item, reflection: string, intention: string, isPublic: boolean) => {
    try {
      await communityManager.sharePrayer(prayer, {
        reflection,
        intention,
        isPublic,
        tags: prayer.tags
      });
      loadCommunityData();
      setShowShareModal(false);
      setSelectedPrayer(null);
    } catch (error) {
      console.error('Failed to share prayer:', error);
    }
  };

  const handleShareInspiration = async (
    type: InspirationPost['type'],
    title: string,
    content: string,
    tags: string[],
    isPublic: boolean
  ) => {
    try {
      await communityManager.shareInspiration(type, title, content, {
        tags,
        isPublic
      });
      loadCommunityData();
      setShowInspirationModal(false);
    } catch (error) {
      console.error('Failed to share inspiration:', error);
    }
  };

  const handleLikePrayer = async (prayerId: string) => {
    await communityManager.likePrayer(prayerId);
    loadCommunityData();
  };

  const handleLikeInspiration = async (postId: string) => {
    await communityManager.likeInspiration(postId);
    loadCommunityData();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${diffDays} hari yang lalu`;
  };

  const getInspirationTypeIcon = (type: InspirationPost['type']) => {
    switch (type) {
      case 'reflection': return 'message-circle';
      case 'gratitude': return 'heart';
      case 'intention': return 'target';
      case 'achievement': return 'award';
      case 'quote': return 'quote';
      default: return 'message-circle';
    }
  };

  const getInspirationTypeLabel = (type: InspirationPost['type']) => {
    switch (type) {
      case 'reflection': return 'Refleksi';
      case 'gratitude': return 'Syukur';
      case 'intention': return 'Niat';
      case 'achievement': return 'Pencapaian';
      case 'quote': return 'Kutipan';
      default: return 'Inspirasi';
    }
  };

  const renderFeed = () => {
    const combinedFeed = [
      ...sharedPrayers.map(p => ({ ...p, type: 'prayer' as const })),
      ...inspirationPosts.map(p => ({ ...p, type: 'inspiration' as const }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
      <div className="space-y-6">
        {combinedFeed.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {item.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {item.userName}
                  </span>
                  <Icon
                    name={item.type === 'prayer' ? 'book-open' : getInspirationTypeIcon((item as any).type)}
                    size={14}
                    className="text-slate-400"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {item.type === 'prayer' ? 'berbagi doa' : getInspirationTypeLabel((item as any).type)}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {formatTimeAgo(new Date(item.timestamp))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {item.title}
              </h3>

              {item.type === 'prayer' ? (
                <div className="space-y-3">
                  <div className="text-slate-700 dark:text-slate-300 text-sm">
                    <span className="font-medium">Kategori:</span> {(item as SharedPrayer).category}
                  </div>
                  {(item as SharedPrayer).reflection && (
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Refleksi:</span>
                      <p className="text-slate-700 dark:text-slate-300 mt-1">
                        {(item as SharedPrayer).reflection}
                      </p>
                    </div>
                  )}
                  {(item as SharedPrayer).intention && (
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Niat:</span>
                      <p className="text-primary-700 dark:text-primary-300 mt-1">
                        {(item as SharedPrayer).intention}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-700 dark:text-slate-300">
                  {(item as any).content}
                </div>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => item.type === 'prayer' ? handleLikePrayer(item.id) : handleLikeInspiration(item.id)}
                className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors"
              >
                <Icon name="heart" size={16} />
                <span className="text-sm">{item.likes}</span>
              </button>

              <button className="flex items-center gap-2 text-slate-500 hover:text-primary-500 transition-colors">
                <Icon name="message-circle" size={16} />
                <span className="text-sm">{item.comments.length}</span>
              </button>

              <button className="flex items-center gap-2 text-slate-500 hover:text-primary-500 transition-colors">
                <Icon name="share" size={16} />
                <span className="text-sm">Bagikan</span>
              </button>
            </div>
          </div>
        ))}

        {combinedFeed.length === 0 && (
          <div className="text-center py-12">
            <Icon name="users" size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Belum Ada Konten
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Jadilah yang pertama berbagi doa atau inspirasi
            </p>
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Bagikan Sekarang
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => {
    if (!userProfile) return null;

    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {userProfile.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Bergabung {new Date(userProfile.joinDate).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{userProfile.stats.prayersShared}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Doa Dibagikan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProfile.stats.inspirationsPosted}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Inspirasi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{userProfile.stats.likesReceived}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Like Diterima</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProfile.stats.streak}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Hari Berturut</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Pencapaian</h3>
          {userProfile.achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {userProfile.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Icon name="award" size={20} className="text-yellow-600" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">{achievement}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">
              Belum ada pencapaian. Mulai berbagi untuk mendapatkan lencana!
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Komunitas
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Berbagi dan berinteraksi dengan sesama muslim
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedPrayer(items[0]);
              setShowShareModal(true);
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Icon name="share" size={16} className="mr-2" />
            Bagikan Doa
          </button>
          <button
            onClick={() => setShowInspirationModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icon name="plus" size={16} className="mr-2" />
            Inspirasi
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        {[
          { id: 'feed', label: 'Beranda', icon: 'home' },
          { id: 'prayers', label: 'Doa', icon: 'book-open' },
          { id: 'inspirations', label: 'Inspirasi', icon: 'heart' },
          { id: 'profile', label: 'Profil', icon: 'user' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Icon name={tab.icon as any} size={16} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'feed' && renderFeed()}
          {activeTab === 'prayers' && renderFeed()}
          {activeTab === 'inspirations' && renderFeed()}
          {activeTab === 'profile' && renderProfile()}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Tags */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Tag Trending
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Statistik Komunitas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Berbagi</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {sharedPrayers.length + inspirationPosts.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Doa Dibagikan</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {sharedPrayers.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Inspirasi</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {inspirationPosts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Prayer Modal */}
      {showShareModal && selectedPrayer && (
        <SharePrayerModal
          prayer={selectedPrayer}
          onShare={handleSharePrayer}
          onClose={() => {
            setShowShareModal(false);
            setSelectedPrayer(null);
          }}
        />
      )}

      {/* Share Inspiration Modal */}
      {showInspirationModal && (
        <ShareInspirationModal
          onShare={handleShareInspiration}
          onClose={() => setShowInspirationModal(false)}
        />
      )}
    </div>
  );
}

// Share Prayer Modal Component
function SharePrayerModal({
  prayer,
  onShare,
  onClose
}: {
  prayer: Item;
  onShare: (prayer: Item, reflection: string, intention: string, isPublic: boolean) => void;
  onClose: () => void;
}) {
  const [reflection, setReflection] = useState('');
  const [intention, setIntention] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Bagikan Doa
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              {prayer.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Kategori: {prayer.category}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Refleksi Pribadi (Opsional)
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              rows={3}
              placeholder="Bagikan pengalaman atau refleksi Anda tentang doa ini..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Niat (Opsional)
            </label>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              rows={2}
              placeholder="Niat atau harapan Anda dari doa ini..."
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700 dark:text-slate-300">Bagikan secara publik</span>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublic ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onShare(prayer, reflection, intention, isPublic)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Bagikan
          </button>
        </div>
      </div>
    </div>
  );
}

// Share Inspiration Modal Component
function ShareInspirationModal({
  onShare,
  onClose
}: {
  onShare: (type: InspirationPost['type'], title: string, content: string, tags: string[], isPublic: boolean) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<InspirationPost['type']>('reflection');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const inspirationTypes = [
    { value: 'reflection', label: 'Refleksi', icon: 'message-circle' },
    { value: 'gratitude', label: 'Syukur', icon: 'heart' },
    { value: 'intention', label: 'Niat', icon: 'target' },
    { value: 'achievement', label: 'Pencapaian', icon: 'award' },
    { value: 'quote', label: 'Kutipan', icon: 'quote' }
  ];

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    onShare(type, title, content, tagList, isPublic);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Bagikan Inspirasi
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Jenis Inspirasi
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as InspirationPost['type'])}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              {inspirationTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Judul
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              placeholder="Judul inspirasi Anda..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Konten
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              rows={4}
              placeholder="Bagikan inspirasi, pemikiran, atau pengalaman spiritual Anda..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tag (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              placeholder="doa, syukur, inspirasi..."
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700 dark:text-slate-300">Bagikan secara publik</span>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublic ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Bagikan
          </button>
        </div>
      </div>
    </div>
  );
}