import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart, removeFromCart } from '../../redux/features/cart/cartSlice';
import ScannerInput from '../../components/ScannerInput';

const formatMoney = (n) => Number(n || 0).toFixed(2);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((s) => s.cart || {});
  const items = cart.products || [];
  const taxRate = cart.taxRate ?? 0.15;

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanLoading, setScanLoading] = useState(false);
  const [scanSuccess, setScanSuccess] = useState('');
  const [scanError, setScanError] = useState('');

  // confirmation map: id -> boolean (true = confirmed)
  const [confirmedMap, setConfirmedMap] = useState({});

  useEffect(() => {
    const map = {};
    items.forEach((p) => {
      if (p.id != null) map[p.id] = false; // Par défaut NON confirmés
    });
    setConfirmedMap(map);
  }, [items]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const computeConfirmedTotals = (confirmedItems) => {
    const subtotal = confirmedItems.reduce((s, p) => s + (p.price || 0) * (p.quantity || 0), 0);
    const tax = Math.round((subtotal * taxRate + Number.EPSILON) * 100) / 100;
    const grand = Math.round((subtotal + tax + Number.EPSILON) * 100) / 100;
    return { subtotal, tax, grand };
  };

  const validate = (confirmedCount) => {
    if (!form.fullName) { setError('Full name required.'); return false; }
    if (!form.cardName) { setError('Name on card required.'); return false; }
    if (!form.cardNumber) { setError('Card number required.'); return false; }
    if (!form.expiry) { setError("Expiration date (MM/YY) required."); return false; }
    if (!form.cvc) { setError('CVC required.'); return false; }
    if (confirmedCount === 0) { setError('Please confirm at least one item for payment.'); return false; }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmedItems = items.filter((p) => confirmedMap[p.id] === true);
    if (!validate(confirmedItems.length)) return;

    const totalsConfirmed = computeConfirmedTotals(confirmedItems);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (confirmedItems.length === items.length) {
        dispatch(clearCart());
      } else {
        confirmedItems.forEach((it) => {
          dispatch(removeFromCart({ id: it.id }));
        });
      }

      // Optionally send totalsConfirmed + form to backend here
      navigate('/order-success', { replace: true });
    }, 900);
  };

  const toggleConfirm = (id) => {
    setConfirmedMap((m) => ({ ...m, [id]: !m[id] }));
  };

  // Nouvelle fonction pour gérer le scan
  const handleScanSuccess = async (scanCode) => {
    setScanLoading(true);
    setScanError('');
    setScanSuccess('');

    try {
      console.log(`🔍 Scanning code: ${scanCode}`);
      
      // Chercher le produit avec ce scanCode dans les items du panier
      const foundItem = items.find(item => {
        // Ici on devrait normalement avoir le scanCode dans les données du produit
        // Pour l'instant, on va simuler en cherchant par nom ou ID
        return item.scanCode === scanCode || 
               item.name.toLowerCase().includes(scanCode.toLowerCase()) ||
               item.id === scanCode;
      });

      if (foundItem) {
        // Marquer comme confirmé
        setConfirmedMap(prev => ({ ...prev, [foundItem.id]: true }));
        setScanSuccess(`"${foundItem.name}" confirmed!`);
        
        // Effacer le message après 3 secondes
        setTimeout(() => setScanSuccess(''), 3000);
      } else {
        // Appeler l'API pour valider le code
        const response = await fetch('/api/scanner/validate-scan-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scanCode })
        });

        const result = await response.json();

        if (result.success) {
          // Vérifier si ce produit est dans le panier
          const cartItem = items.find(item => item.id === result.product.id);
          
          if (cartItem) {
            setConfirmedMap(prev => ({ ...prev, [cartItem.id]: true }));
            setScanSuccess(`"${result.product.name}" confirmed!`);
            setTimeout(() => setScanSuccess(''), 3000);
          } else {
            setScanError(`Le produit "${result.product.name}" n'est pas dans votre panier`);
            setTimeout(() => setScanError(''), 5000);
          }
        } else {
          setScanError(result.message || 'Code non reconnu');
          setTimeout(() => setScanError(''), 5000);
        }
      }
      
    } catch (err) {
      console.error('Scan error:', err);
      setScanError('Error validating code');
      setTimeout(() => setScanError(''), 5000);
    } finally {
      setScanLoading(false);
    }
  };

  const handleScanError = (error) => {
    setScanError(`Scan error: ${error}`);
    setTimeout(() => setScanError(''), 5000);
  };

  const removeUnconfirmedFromCart = () => {
    const unconfirmed = items.filter((p) => confirmedMap[p.id] === false);
    if (unconfirmed.length === 0) {
      setScanError('No unconfirmed items to remove.');
      setTimeout(() => setScanError(''), 3000);
      return;
    }
    unconfirmed.forEach((it) => dispatch(removeFromCart({ id: it.id })));
  };

  const confirmedItems = items.filter((p) => confirmedMap[p.id] === true);
  const confirmedTotals = computeConfirmedTotals(confirmedItems);

  return (
    <div className="max-w-6xl mx-auto p-6 items-start pt-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT: Client + Payment */}
        <div className="md:w-2/3 bg-white shadow-sm ring-1 ring-gray-200 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-1">Customer Information</h2>
          <p className="text-sm text-gray-600 mb-4">Your information will remain confidential.</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Ex. John Doe"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
  placeholder="example@domain.com"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="pt-2">
              <h3 className="text-lg font-medium">Payment</h3>
              <p className="text-xs text-gray-500 mb-3">Enter your card information.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on card <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cardName"
                    name="cardName"
                    value={form.cardName}
                    onChange={handleChange}
                    placeholder="As shown on card"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
                    autoComplete="cc-name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono tracking-widest text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    maxLength={19} // 16 digits + spaces
                  />
                  <p className="mt-1 text-xs text-gray-500">No dashes, spaces are ok.</p>
                </div>

                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration (MM/YY) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="expiry"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cvc"
                    name="cvc"
                    value={form.cvc}
                    onChange={handleChange}
                    placeholder="123"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {/* Erreurs & actions */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Link to="/shop" className="text-sm text-gray-600 hover:text-gray-800 hover:underline">
                Continue shopping
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-pink-600 text-white px-4 py-2 font-medium hover:bg-pink-700 disabled:opacity-60"
              >
                {loading ? 'Processing…' : `Pay $${formatMoney(confirmedTotals.grand)}`}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Order summary */}
        <div className="md:w-1/3 bg-white shadow p-6 rounded">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          {/* Scanner invisible + Messages */}
          <div className="mb-4">
            <ScannerInput
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
              disabled={scanLoading}
            />
            
            {/* Messages de scan */}
            {scanSuccess && (
              <div className="mt-2 p-3 bg-green-100 border border-green-300 text-green-700 text-sm rounded-lg">
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>{scanSuccess}</span>
                </div>
              </div>
            )}
            
            {scanError && (
              <div className="mt-2 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg">
                <div className="flex items-center space-x-2">
                  <span>❌</span>
                  <span>{scanError}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3 max-h-64 overflow-auto">{items.length === 0 ? (
              <div className="text-gray-600">No items</div>
            ) : (
              items.map((p, i) => (
                <div key={p.id ?? i} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded" />
                  <div className="flex-1">
                    <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                    <div className="text-xs text-gray-500">Qty: {p.quantity}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Une seule checkbox pour confirmation */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={confirmedMap[p.id] === true}
                        onChange={() => toggleConfirm(p.id)}
                        className="w-4 h-4"
                      />
                      <span className={`text-sm font-medium ${
                        confirmedMap[p.id] === true ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {confirmedMap[p.id] === true ? 'Confirmed' : 'Not confirmed'}
                      </span>
                    </label>
                    <div className="text-sm font-medium">
                      ${formatMoney((p.price || 0) * (p.quantity || 1))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal (confirmed)</span>
              <span>${formatMoney(confirmedTotals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>${formatMoney(confirmedTotals.tax)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total to pay</span>
              <span>${formatMoney(confirmedTotals.grand)}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {/* Boutons d'action */}
            <div className="flex gap-2">
              <button onClick={removeUnconfirmedFromCart} className="bg-pink-600 text-white px-3 py-2 rounded text-sm">
                Remove unconfirmed
              </button>
              
              <button
                onClick={() => {
                  const allConfirmed = items.every((p) => confirmedMap[p.id] === true);
                  const map = {};
                  items.forEach((p) => { map[p.id] = !allConfirmed; });
                  setConfirmedMap(map);
                }}
                className="bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-300"
              >
                {items.every((p) => confirmedMap[p.id] === true) ? 'Uncheck all' : 'Check all'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
