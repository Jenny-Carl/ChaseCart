import React, {useState, useEffect} from 'react'
import bannerImg from "../../assets/supermarket1.png"
import { productsApi } from '../../services/api'
import ProductCards from '../shop/ProductCards';

const Search = () => {
    const[searchQuery, setSearchQuerry] = useState('');
    const[filtredProducts, setFiltredProducts] = useState([]);
    const[allProducts, setAllProducts] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);
    
    // Charger tous les produits au montage du composant
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const products = await productsApi.getAll();
                setAllProducts(products);
                setFiltredProducts(products); // Afficher tous les produits par défaut
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
            // Si la recherche est vide, afficher tous les produits
            setFiltredProducts(allProducts);
            return;
        }

        try {
            setLoading(true);
            // Utiliser l'API de recherche du backend
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
        <>
      <section
            className=" h-20 relative min-h-[300px] flex items-start justify-center text-center pt-20"
            style={{
              backgroundImage: `url(${bannerImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label="Banner ChaseCart"
          >
            {/* Overlay blanc avec opacité */}
            <div className="absolute inset-0 bg-white/60 pointer-events-none" />
      
            <div className="header__content relative z-20 max-w-3xl text-black px-6 items-center">
               <h2 className="section__header capitalize">Search Products</h2>
               <p className="section__subheader">
                Browse a wide selection of categories, from everyday essentials to exciting new finds. Whatever you're looking for, we've got something for you!
                </p>
              
            </div>
          </section>

      <section className='section__container'>
        <div className='w-full mb-12 flex flex-col md:flex-row items-center'>
          <input
            className='search-bar w-full max-w-4x1 p-2 border rounded'
            type='text'
            placeholder='Search for products...'
            value={searchQuery}
            onChange={(e) => setSearchQuerry(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}
           className='search-button w-full md:w-auto py-3 px-8 bg-primary text-white rounded'>
           {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <p>Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                {filtredProducts.length} product(s) found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            <ProductCards products={filtredProducts}/>
          </>
        )}

      </section>
      </>
    );
}

export default Search