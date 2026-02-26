import React from 'react';
import { Link } from 'react-router-dom';
import category1 from "../../assets/category-1.jpg";
import category2 from "../../assets/category-2.jpg";
import category3 from "../../assets/category-3.jpg";
import category4 from "../../assets/category-4.jpg";

const CategoriesMobile = () => {
    const categories = [
        { name: 'Groceries', path: 'groceries', image: category1 },
        { name: 'Clothing & Shoes', path: 'clothing', image: category2 },
        { name: 'Electronics', path: 'electronics', image: category3 },
        { name: 'Personal Care', path: 'personal-care', image: category4 }
    ];

    return (
        <div className="px-4 py-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                Shop by Category
            </h2>
            
            <div className='grid grid-cols-2 gap-4'>
                {categories.map((category, index) => (
                    <Link 
                        key={index}
                        to={`/categories/${category.path}`} 
                        className='bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden'
                    >
                        <div className="aspect-square w-full">
                            <img 
                                src={category.image} 
                                alt={category.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-3 text-center">
                            <h4 className="text-sm font-semibold text-gray-800">
                                {category.name}
                            </h4>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoriesMobile;
