import React, { useState, useEffect } from 'react';
import bannerImg from "../../assets/supermarket1.png";
import { productsApi } from '../../services/api';
import ProductCardsMobile from '../../components/mobile/ProductCardsMobile';

const SearchMobile = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filtredProducts, setFiltredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Charger tous les produits au montage du composant
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const products = await productsApi.getAll();
                setAllProducts(products);
                setFiltredProducts(products);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Error loading products');
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);
    
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setFiltredProducts(allProducts);
            return;
        }

        try {
            setLoading(true);
            const results = await productsApi.search(searchQuery);
            setFiltredProducts(results);
        } catch (err) {
            console.error('Error searching products:', err);
            setError('Error during search. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-16">
            {/* Banner Mobile */}
            <section
                className="relative h-40 flex items-center justify-center text-center px-4"
                style={{
                    backgroundImage: `url(${bannerImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-white/70 pointer-events-none" />
                
                <div className="relative z-20 text-black px-4">
                    <h2 className="text-2xl font-bold mb-2">Search Products</h2>
                    <p className="text-xs text-gray-700">
                        Find what you need quickly
                    </p>
                </div>
            </section>

            {/* Search Section */}
            <section className='px-3 py-6'>
                <div className='flex gap-2 mb-6'>
                    <input
                        className='flex-1 px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none'
                        type='text'
                        placeholder='Search for products...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                        onClick={handleSearch}
                        className='px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors'
                        disabled={loading}
                    >
                        {loading ? '...' : 'Search'}
                    </button>
                </div>
                
                {loading && (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-600">Loading...</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-8 text-red-500">
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                {!loading && !error && (
                    <>
                        <div className="mb-2">
                            <p className="text-sm text-gray-600">
                                {filtredProducts.length} product(s)
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                        </div>
                        <ProductCardsMobile products={filtredProducts}/>
                    </>
                )}
            </section>
        </div>
    );
};

export default SearchMobile;
