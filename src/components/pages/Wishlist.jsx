import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getWishlistItems, moveToCart, removeFromWishlist } from "@/services/api/wishlistService";
import { addToCart } from "@/services/api/cartService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Cart from "@/components/pages/Cart";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const WishlistCard = ({ item, onRemove, onMoveToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-all duration-120 ease-out overflow-hidden"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-light-gray">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium text-sm">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-display font-semibold text-charcoal mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-charcoal">
            ${item.price.toFixed(2)}
          </span>
          {item.originalPrice && (
            <span className="text-sm text-medium-gray line-through">
              ${item.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {item.rating && (
          <div className="flex items-center gap-1 mb-3">
            <ApperIcon name="Star" size={14} className="text-bronze fill-bronze" />
            <span className="text-sm text-charcoal font-medium">
              {item.rating.toFixed(1)}
            </span>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            onClick={() => onMoveToCart(item.Id)}
            disabled={!item.inStock}
            className="flex-1 text-sm py-2"
          >
            <ApperIcon name="ShoppingCart" size={16} className="mr-1" />
            Add to Cart
          </Button>
          
          <button
            onClick={() => onRemove(item.Id)}
            className="p-2 text-charcoal hover:text-error transition-colors"
            aria-label="Remove from wishlist"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      loadWishlist();
    };
    
    window.addEventListener('wishlist_updated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlist_updated', handleWishlistUpdate);
    };
  }, []);

  const loadWishlist = () => {
    setLoading(true);
    setTimeout(() => {
      const wishlistItems = getWishlistItems();
      setItems(wishlistItems);
      setLoading(false);
    }, 300);
  };

  const handleRemove = (productId) => {
    const item = items.find(i => i.Id === productId);
    if (removeFromWishlist(productId)) {
      toast.success(`Removed ${item?.name || 'item'} from wishlist`);
    }
  };

  const handleMoveToCart = (productId) => {
    const item = items.find(i => i.Id === productId);
    
    if (!item) return;
    
    const cartItem = {
      productId: item.Id,
      name: item.name,
      price: item.price,
      quantity: 1,
      size: 'M',
      color: 'Black',
      image: item.images[0]
    };
    
    addToCart(cartItem);
    removeFromWishlist(productId);
    
toast.success(`Added ${item.name} to cart`);
    
    // Trigger cart update event
    const event = new Event('cart_updated');
    window.dispatchEvent(event);
  };

  if (loading) {
    return <Loading />;
  }

  if (items.length === 0) {
    return (
      <Empty
        icon="Heart"
        title="Your wishlist is empty"
        message="Save items you love to your wishlist and find them here later"
        action={{
          label: "Continue Shopping",
          onClick: () => navigate("/shop")
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">
            My Wishlist
          </h1>
          <p className="text-medium-gray">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <WishlistCard
              key={item.Id}
              item={item}
              onRemove={handleRemove}
              onMoveToCart={handleMoveToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;