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
      <div className="max-w-4xl mx-auto p-8 text-center text-slate-500 text-xs">
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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <img
            src={myUmkm.imageUrl}
            alt={myUmkm.businessName}
            className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{myUmkm.businessName}</h1>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  myUmkm.approvalStatus === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                Status: {myUmkm.approvalStatus}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-xl">{myUmkm.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {myUmkm.address}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {myUmkm.phone}
              </span>
              {myUmkm.instagram && (
                <span className="flex items-center gap-1 text-pink-600 font-medium">
                  <Instagram className="w-3.5 h-3.5" />
                  {myUmkm.instagram}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-[11px] text-slate-400 block">Mitra Destinasi:</span>
          <span className="text-xs font-semibold text-slate-800">
            {associatedDestinations.map((d) => d.name).join(', ') || 'Belum terhubung'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('dashboard')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard UMKM</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Profil Usaha</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('products')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Katalog Produk ({myUmkm.products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('promotions')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'promotions'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Promosi Traveler ({myUmkm.promotions.length})</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick KPI Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Total Produk</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {myUmkm.products.length}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <span>Promosi Aktif</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {myUmkm.promotions.length}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Dilihat Traveler</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {myUmkm.viewsCount || 148}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Kunjungan/Klaim</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {myUmkm.travelerInteractionsCount || 52}
                  </span>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-emerald-950">Katalog Produk UMKM</h3>
                    <p className="text-xs text-emerald-800 mt-1">
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
                    className="self-start px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Produk Baru</span>
                  </button>
                </div>

                <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-amber-950">Promosi & Diskon Wisatawan</h3>
                    <p className="text-xs text-amber-800 mt-1">
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
                    className="self-start px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat Promosi Traveler</span>
                  </button>
                </div>
              </div>

              {/* Guidance for UMKM */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
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
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Kelola Informasi Usaha UMKM</h3>
                  <p className="text-xs text-slate-500">
                    Informasi ini akan ditampilkan kepada traveler di halaman Discovery Lokal & Rekomendasi Destinasi.
                  </p>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                  Status Legal: {myUmkm.approvalStatus === 'approved' ? 'Terverifikasi Super Admin' : 'Menunggu Verifikasi'}
                </span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Nama Usaha / Toko</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Nama Pemilik</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Kategori Usaha</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="culinary">Kuliner & Oleh-oleh Makanan</option>
                      <option value="craft">Kriya & Kerajinan Tradisional</option>
                      <option value="souvenir">Cinderamata & Souvenir</option>
                      <option value="homestay">Homestay & Penginapan Lokal</option>
                      <option value="workshop">Workshop & Edukasi Budaya</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Instagram</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@nama_umkm"
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Foto Usaha (URL)</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Alamat Lengkap Usaha</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Deskripsi Usaha & Cerita Tradisi</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs transition"
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Daftar Menu & Produk Lokal</h3>
                  <p className="text-xs text-slate-500">
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk</span>
                </button>
              </div>

              {myUmkm.products.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                  Belum ada produk yang ditambahkan. Silakan klik "Tambah Produk" untuk mulai.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {myUmkm.products.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3 hover:border-emerald-200 transition"
                    >
                      <div className="space-y-2">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-36 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-slate-900">{prod.name}</h4>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {prod.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{prod.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                        <span className="font-mono font-bold text-emerald-700">
                          Rp {prod.priceIdr.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Program Diskon & Voucher Wisatawan
                  </h3>
                  <p className="text-xs text-slate-500">
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
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Promosi Traveler</span>
                </button>
              </div>

              {myUmkm.promotions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                  Belum ada promosi aktif. Buat penawaran diskon khusus untuk menarik traveler.
                </div>
              ) : (
                <div className="space-y-3">
                  {myUmkm.promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50/60 to-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                            Diskon {promo.discountPercentage}%
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            Berlaku s/d {promo.validUntil}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{promo.title}</h4>
                        <p className="text-slate-600 text-xs">{promo.description}</p>
                      </div>

                      <div className="p-3 bg-white border border-amber-300 rounded-xl text-center font-mono font-bold text-amber-900 text-xs shrink-0 shadow-xs">
                        <span className="block text-[10px] text-amber-700 font-normal uppercase">Kode Voucher</span>
                        <span className="text-sm">{promo.promoCode}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Tambah Produk UMKM</span>
              </h3>
              <button onClick={() => setProductModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Produk</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Contoh: Kopi Luwak Desa Asli"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Kategori</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="culinary">Kuliner</option>
                    <option value="souvenir">Oleh-oleh</option>
                    <option value="craft">Kriya & Seni</option>
                    <option value="fashion">Pakaian/Batik</option>
                    <option value="guide">Jasa Lokal</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Harga (IDR)</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(parseInt(e.target.value) || 0)}
                    required
                    min={1000}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Bahan lokal alami pilihan dari masyarakat desa sekitar..."
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Foto Produk (URL)</label>
                <input
                  type="url"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Buat Promosi Traveler</span>
              </h3>
              <button onClick={() => setPromoModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
              </button>
            </div>
            <form onSubmit={handleAddPromotion} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Judul Penawaran</label>
                <input
                  type="text"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  required
                  placeholder="Contoh: Diskon 20% Minuman Herbal Khas"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Diskon (%)</label>
                  <input
                    type="number"
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(parseInt(e.target.value) || 10)}
                    required
                    min={5}
                    max={100}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Kode Promo</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    required
                    placeholder="TAKONO20"
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Masa Berlaku</label>
                <input
                  type="date"
                  value={promoValidUntil}
                  onChange={(e) => setPromoValidUntil(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Keterangan & Syarat</label>
                <textarea
                  rows={2}
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                  required
                  placeholder="Tunjukkan bukti check-in TAKONO di kasir..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition"
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
