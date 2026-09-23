import React, { useState, useEffect } from 'react';
import { useTakonoStore } from '../../services/store';
import { UMKMProduct, UMKMPromotion } from '../../types/umkm';
import {
  Building2,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Clock,
  Plus,
  Edit3,
  Phone,
  MapPin,
  X,
  TrendingUp,
  BarChart3,
  Award,
  Save,
  Instagram,
  Eye,
  Users,
  Percent,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const UMKMDashboard: React.FC = () => {
  const {
    currentUser,
    umkmList,
    destinations,
    updateUMKMProfile,
    addUMKMProduct,
    addUMKMPromotion,
    activeRoute,
    navigateTo,
  } = useTakonoStore();

  // Find UMKM owned by current user (or fallback to first UMKM in store)
  const myUmkm = umkmList.find((u) => u.ownerId === currentUser.id) || umkmList[0];

  // Derive active tab from activeRoute
  const getTabFromRoute = (route: string): 'dashboard' | 'profile' | 'products' | 'promotions' => {
    if (route.includes('/profile')) return 'profile';
    if (route.includes('/products')) return 'products';
    if (route.includes('/promotions')) return 'promotions';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'products' | 'promotions'>(
    getTabFromRoute(activeRoute)
  );

  useEffect(() => {
    setActiveTab(getTabFromRoute(activeRoute));
  }, [activeRoute]);

  const handleTabChange = (tab: 'dashboard' | 'profile' | 'products' | 'promotions') => {
    setActiveTab(tab);
    if (tab === 'dashboard') navigateTo('/umkm/dashboard');
    else if (tab === 'profile') navigateTo('/umkm/profile');
    else if (tab === 'products') navigateTo('/umkm/products');
    else if (tab === 'promotions') navigateTo('/umkm/promotions');
  };

  // Notification state
  const [notification, setNotification] = useState<string | null>(null);
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Product modal
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>('');
  const [productDesc, setProductDesc] = useState<string>('');
  const [productPrice, setProductPrice] = useState<number>(15000);
  const [productCategory, setProductCategory] = useState<'culinary' | 'souvenir' | 'craft' | 'fashion' | 'guide'>('culinary');
  const [productImage, setProductImage] = useState<string>('https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800');

  // Promo modal
  const [promoModalOpen, setPromoModalOpen] = useState<boolean>(false);
  const [promoTitle, setPromoTitle] = useState<string>('');
  const [promoDesc, setPromoDesc] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(15);
  const [promoCode, setPromoCode] = useState<string>('TAKONO15');
  const [promoValidUntil, setPromoValidUntil] = useState<string>('2026-12-31');

  // Profile Edit State
  const [businessName, setBusinessName] = useState<string>(myUmkm?.businessName || '');
  const [ownerName, setOwnerName] = useState<string>(myUmkm?.ownerName || '');
  const [address, setAddress] = useState<string>(myUmkm?.address || '');
  const [phone, setPhone] = useState<string>(myUmkm?.phone || '');
  const [instagram, setInstagram] = useState<string>(myUmkm?.instagram || '');
  const [description, setDescription] = useState<string>(myUmkm?.description || '');
  const [category, setCategory] = useState<'culinary' | 'craft' | 'souvenir' | 'homestay' | 'workshop'>(
    myUmkm?.category || 'culinary'
  );
  const [imageUrl, setImageUrl] = useState<string>(myUmkm?.imageUrl || '');

  // Keep profile form synced when myUmkm updates
  useEffect(() => {
    if (myUmkm) {
      setBusinessName(myUmkm.businessName);
      setOwnerName(myUmkm.ownerName);
      setAddress(myUmkm.address);
      setPhone(myUmkm.phone);
      setInstagram(myUmkm.instagram || '');
      setDescription(myUmkm.description);
      setCategory(myUmkm.category);
      setImageUrl(myUmkm.imageUrl);
    }
  }, [myUmkm?.id]);

  if (!myUmkm) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-neutral-500 text-xs font-medium">
        Data UMKM belum ditemukan.
      </div>
    );
  }

  const associatedDestinations = destinations.filter((d) =>
    myUmkm.associatedDestinationIds.includes(d.id)
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    addUMKMProduct(myUmkm.id, {
      name: productName,
      description: productDesc,
      priceIdr: Number(productPrice) || 0,
      imageUrl: productImage,
      category: productCategory,
      isAvailable: true,
    });

    setProductModalOpen(false);
    showNotification(`Produk "${productName}" berhasil ditambahkan ke katalog!`);
    setProductName('');
    setProductDesc('');
  };

  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle.trim() || !promoCode.trim()) return;

    addUMKMPromotion(myUmkm.id, {
      title: promoTitle,
      description: promoDesc,
      discountPercentage: Number(promoDiscount) || 10,
      promoCode: promoCode.toUpperCase().trim(),
      validUntil: promoValidUntil,
      isActive: true,
    });

    setPromoModalOpen(false);
    showNotification(`Promosi "${promoTitle}" berhasil diterbitkan!`);
    setPromoTitle('');
    setPromoDesc('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUMKMProfile({
      id: myUmkm.id,
      businessName,
      ownerName,
      address,
      phone,
      instagram,
      description,
      category,
      imageUrl,
    });
    showNotification('Profil usaha UMKM berhasil diperbarui!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-neutral-800 antialiased">
      
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 border border-emerald-500">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{notification}</span>
          </div>
          <button 
            onClick={() => setNotification(null)} 
            className="p-1 text-emerald-200 hover:text-white transition rounded-lg hover:bg-emerald-700/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition hover:border-neutral-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
          <div className="relative shrink-0">
            <img
              src={myUmkm.imageUrl}
              alt={myUmkm.businessName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-neutral-200 shadow-md"
            />
            <span className="absolute -bottom-1.5 -right-1.5 p-1 bg-emerald-600 text-white rounded-full shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {myUmkm.businessName}
              </h1>
              <span
                className={`text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                  myUmkm.approvalStatus === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                STATUS: {myUmkm.approvalStatus}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-2">
              {myUmkm.description}
            </p>

            <div className="flex items-center gap-4 text-xs font-medium text-neutral-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{myUmkm.address}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{myUmkm.phone}</span>
              </span>
              {myUmkm.instagram && (
                <span className="flex items-center gap-1.5 text-pink-600 font-semibold">
                  <Instagram className="w-4 h-4 shrink-0" />
                  <span>{myUmkm.instagram}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left lg:text-right shrink-0 space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">Mitra Destinasi:</span>
          <span className="text-xs font-extrabold text-neutral-800 block">
            {associatedDestinations.map((d) => d.name).join(', ') || 'Belum terhubung'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
        <div className="flex border-b border-neutral-100 bg-neutral-50/60 text-xs font-bold overflow-x-auto p-1.5 gap-1 scrollbar-none">
          <button
            type="button"
            onClick={() => handleTabChange('dashboard')}
            className={`px-5 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard UMKM</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`px-5 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Profil Usaha</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('products')}
            className={`px-5 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Katalog Produk ({myUmkm.products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('promotions')}
            className={`px-5 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'promotions'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Promosi Traveler ({myUmkm.promotions.length})</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Quick KPI Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 hover:border-emerald-300 hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold mb-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Total Produk</span>
                  </div>
                  <span className="text-3xl font-black font-mono text-neutral-900">
                    {myUmkm.products.length}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 hover:border-amber-300 hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold mb-2">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <span>Promosi Aktif</span>
                  </div>
                  <span className="text-3xl font-black font-mono text-neutral-900">
                    {myUmkm.promotions.length}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 hover:border-blue-300 hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold mb-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Dilihat Traveler</span>
                  </div>
                  <span className="text-3xl font-black font-mono text-neutral-900">
                    {myUmkm.viewsCount || 384}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 hover:border-purple-300 hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Kunjungan/Klaim</span>
                  </div>
                  <span className="text-3xl font-black font-mono text-neutral-900">
                    {myUmkm.travelerInteractionsCount || 142}
                  </span>
                </div>
              </div>

              {/* Action Shortcuts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-emerald-200/80 bg-emerald-50/40 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-base text-emerald-950">Katalog Produk UMKM</h3>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Tambahkan menu kuliner, cinderamata, atau karya kriya khas agar dapat ditemukan wisatawan yang sedang berjelajah.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProductName('');
                      setProductDesc('');
                      setProductPrice(15000);
                      setProductModalOpen(true);
                    }}
                    className="self-start px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Produk Baru</span>
                  </button>
                </div>

                <div className="p-6 rounded-3xl border border-amber-200/80 bg-amber-50/40 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-base text-amber-950">Promosi & Diskon Wisatawan</h3>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Tawarkan diskon belanja khusus pengguna TAKONO untuk menarik kunjungan dari titik jelajah terdekat.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPromoTitle('');
                      setPromoDesc('');
                      setPromoDiscount(15);
                      setPromoCode('TAKONO15');
                      setPromoModalOpen(true);
                    }}
                    className="self-start px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Promosi Traveler</span>
                  </button>
                </div>
              </div>

              {/* Guidance for UMKM */}
              <div className="p-5 bg-neutral-50 border border-neutral-200/90 rounded-2xl space-y-2 text-xs text-neutral-600 leading-relaxed">
                <div className="flex items-center gap-2 font-extrabold text-neutral-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Integrasi Ekosistem TAKONO:</span>
                </div>
                <p>
                  Wisatawan yang menyelesaikan rute jelajah budaya akan diarahkan langsung ke UMKM binaan melalui fitur <strong>Discovery Lokal</strong> dan <strong>Katalog Reward</strong>. Pastikan produk dan promosi Anda selalu terbarui.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PROFIL USAHA */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-base text-neutral-900">Kelola Informasi Usaha UMKM</h3>
                  <p className="text-xs text-neutral-500">
                    Informasi ini akan ditampilkan kepada traveler di halaman Discovery Lokal & Rekomendasi Destinasi.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
                  Status Legal: {myUmkm.approvalStatus === 'approved' ? 'Terverifikasi Super Admin' : 'Menunggu Verifikasi'}
                </span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700">Nama Usaha / Toko</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700">Nama Pemilik</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700">Kategori Usaha</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition font-semibold"
                    >
                      <option value="culinary">Kuliner & Oleh-oleh Makanan</option>
                      <option value="craft">Kriya & Kerajinan Tradisional</option>
                      <option value="souvenir">Cinderamata & Souvenir</option>
                      <option value="homestay">Homestay & Penginapan Lokal</option>
                      <option value="workshop">Workshop & Edukasi Budaya</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700">Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700">Instagram</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@nama_umkm"
                      className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700">Foto Usaha (URL)</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono text-neutral-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Alamat Lengkap Usaha</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Deskripsi Usaha & Cerita Tradisi</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-neutral-100">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-neutral-900">Daftar Menu & Produk Lokal</h3>
                  <p className="text-xs text-neutral-500">
                    Produk yang ditampilkan pada katalog belanja wisatawan TAKONO.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProductName('');
                    setProductDesc('');
                    setProductPrice(15000);
                    setProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk</span>
                </button>
              </div>

              {myUmkm.products.length === 0 ? (
                <div className="p-12 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-300 text-neutral-400 text-xs">
                  Belum ada produk yang ditambahkan. Silakan klik "Tambah Produk" untuk mulai.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myUmkm.products.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-3xl border border-neutral-200/90 bg-white flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-lg transition group"
                    >
                      <div className="space-y-3">
                        <div className="relative overflow-hidden rounded-2xl h-40">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-extrabold text-sm text-neutral-900">{prod.name}</h4>
                          <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 shrink-0">
                            {prod.category}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
                        <span className="font-mono font-black text-emerald-700 text-sm">
                          Rp {prod.priceIdr.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Tersedia
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-neutral-900">
                    Program Diskon & Voucher Wisatawan
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Kupon diskon yang dapat diklaim traveler saat berkunjung langsung ke toko Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPromoTitle('');
                    setPromoDesc('');
                    setPromoDiscount(15);
                    setPromoCode('TAKONO15');
                    setPromoModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Promosi Traveler</span>
                </button>
              </div>

              {myUmkm.promotions.length === 0 ? (
                <div className="p-12 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-300 text-neutral-400 text-xs">
                  Belum ada promosi aktif. Buat penawaran diskon khusus untuk menarik traveler.
                </div>
              ) : (
                <div className="space-y-4">
                  {myUmkm.promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="p-5 rounded-3xl border border-amber-200/90 bg-gradient-to-r from-amber-50/50 via-white to-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs hover:shadow-md transition"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-black uppercase bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-md">
                            Diskon {promo.discountPercentage}%
                          </span>
                          <span className="text-neutral-400 font-mono text-[11px]">
                            Berlaku s/d {promo.validUntil}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-base text-neutral-900">{promo.title}</h4>
                        <p className="text-neutral-600 text-xs">{promo.description}</p>
                      </div>

                      <div className="p-3.5 bg-white border border-amber-300 rounded-2xl text-center font-mono font-bold text-amber-950 text-xs shrink-0 shadow-xs w-full sm:w-auto">
                        <span className="block text-[9px] text-amber-700 font-bold uppercase tracking-wider">Kode Voucher</span>
                        <span className="text-base font-black tracking-widest">{promo.promoCode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-8 space-y-5 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-extrabold text-base text-neutral-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span>Tambah Produk UMKM</span>
              </h3>
              <button 
                onClick={() => setProductModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Nama Produk</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Contoh: Kopi Luwak Desa Asli"
                  required
                  className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Kategori</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition font-semibold"
                  >
                    <option value="culinary">Kuliner</option>
                    <option value="souvenir">Oleh-oleh</option>
                    <option value="craft">Kriya & Seni</option>
                    <option value="fashion">Pakaian/Batik</option>
                    <option value="guide">Jasa Lokal</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Harga (IDR)</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(parseInt(e.target.value) || 0)}
                    required
                    min={1000}
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Bahan lokal alami pilihan dari masyarakat desa sekitar..."
                  required
                  className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Foto Produk (URL)</label>
                <input
                  type="url"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono text-neutral-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold uppercase tracking-wider transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promo Modal */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-8 space-y-5 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-extrabold text-base text-neutral-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Buat Promosi Traveler</span>
              </h3>
              <button 
                onClick={() => setPromoModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPromotion} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Judul Penawaran</label>
                <input
                  type="text"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  required
                  placeholder="Contoh: Diskon 20% Minuman Herbal Khas"
                  className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Diskon (%)</label>
                  <input
                    type="number"
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(parseInt(e.target.value) || 10)}
                    required
                    min={5}
                    max={100}
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Kode Promo</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    required
                    placeholder="TAKONO20"
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Masa Berlaku</label>
                <input
                  type="date"
                  value={promoValidUntil}
                  onChange={(e) => setPromoValidUntil(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Keterangan & Syarat</label>
                <textarea
                  rows={2}
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                  required
                  placeholder="Tunjukkan bukti check-in TAKONO di kasir..."
                  className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-blue-600 focus:outline-none transition leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-extrabold uppercase tracking-wider transition shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Terbitkan Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};