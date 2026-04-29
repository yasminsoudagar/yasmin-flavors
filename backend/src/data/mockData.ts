export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isVeg: boolean;
  stock: number;
  discount: number;
  tags: string[];
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';
  date: string;
  address: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: 1, name: "Burgers", icon: "🍔", count: 24 },
  { id: 2, name: "Pizza", icon: "🍕", count: 18 },
  { id: 3, name: "Sushi", icon: "🍣", count: 15 },
  { id: 4, name: "Desserts", icon: "🍰", count: 22 },
  { id: 5, name: "Drinks", icon: "🥤", count: 30 },
  { id: 6, name: "Biryani", icon: "🍛", count: 12 },
  { id: 7, name: "Salads", icon: "🥗", count: 16 },
  { id: 8, name: "Noodles", icon: "🍜", count: 20 },
];

export const foodItems: FoodItem[] = [
  { id: 1, name: "Classic Smash Burger", description: "Juicy double patty with cheddar, caramelized onions & special sauce", price: 12.99, originalPrice: 15.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", category: "Burgers", rating: 4.8, reviews: 324, isVeg: false, stock: 15, discount: 19, tags: ["bestseller", "spicy"] },
  { id: 2, name: "Margherita Pizza", description: "Fresh mozzarella, San Marzano tomatoes & basil on crispy crust", price: 14.99, originalPrice: 18.99, image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop", category: "Pizza", rating: 4.7, reviews: 256, isVeg: true, stock: 8, discount: 21, tags: ["popular"] },
  { id: 3, name: "Dragon Roll", description: "Shrimp tempura, avocado, eel & tobiko with spicy mayo drizzle", price: 18.99, originalPrice: 22.99, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop", category: "Sushi", rating: 4.9, reviews: 189, isVeg: false, stock: 5, discount: 17, tags: ["premium"] },
  { id: 4, name: "Tiramisu", description: "Classic Italian coffee-soaked ladyfingers with mascarpone cream", price: 8.99, originalPrice: 10.99, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop", category: "Desserts", rating: 4.6, reviews: 412, isVeg: true, stock: 20, discount: 18, tags: ["bestseller"] },
  { id: 5, name: "Mango Smoothie", description: "Fresh alphonso mango blended with yogurt, honey & ice", price: 6.99, originalPrice: 8.99, image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop", category: "Drinks", rating: 4.5, reviews: 178, isVeg: true, stock: 25, discount: 22, tags: ["refreshing"] },
  { id: 6, name: "Hyderabadi Biryani", description: "Aromatic basmati rice layered with tender meat & saffron", price: 16.99, originalPrice: 19.99, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", category: "Biryani", rating: 4.9, reviews: 567, isVeg: false, stock: 3, discount: 15, tags: ["bestseller", "spicy"] },
  { id: 7, name: "Caesar Salad", description: "Crisp romaine, parmesan, croutons & house-made caesar dressing", price: 10.99, originalPrice: 12.99, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop", category: "Salads", rating: 4.4, reviews: 145, isVeg: true, stock: 18, discount: 15, tags: ["healthy"] },
  { id: 8, name: "Pad Thai", description: "Stir-fried rice noodles with shrimp, tofu, peanuts & lime", price: 13.99, originalPrice: 16.99, image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop", category: "Noodles", rating: 4.7, reviews: 298, isVeg: false, stock: 12, discount: 18, tags: ["popular"] },
  { id: 9, name: "BBQ Bacon Burger", description: "Smoky BBQ sauce, crispy bacon, onion rings & pepper jack", price: 14.99, originalPrice: 17.99, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop", category: "Burgers", rating: 4.6, reviews: 234, isVeg: false, stock: 10, discount: 17, tags: ["spicy"] },
  { id: 10, name: "Pepperoni Pizza", description: "Loaded pepperoni with extra mozzarella on hand-tossed dough", price: 15.99, originalPrice: 19.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop", category: "Pizza", rating: 4.8, reviews: 445, isVeg: false, stock: 6, discount: 20, tags: ["bestseller"] },
  { id: 11, name: "Chocolate Lava Cake", description: "Warm molten chocolate center with vanilla ice cream", price: 9.99, originalPrice: 12.99, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop", category: "Desserts", rating: 4.8, reviews: 389, isVeg: true, stock: 14, discount: 23, tags: ["premium", "bestseller"] },
  { id: 12, name: "Berry Blast Shake", description: "Mixed berries, banana & protein powder power shake", price: 7.99, originalPrice: 9.99, image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop", category: "Drinks", rating: 4.3, reviews: 156, isVeg: true, stock: 22, discount: 20, tags: ["healthy"] },
];

export const testimonials: Testimonial[] = [
  { id: 1, name: "Sarah Johnson", avatar: "https://i.pravatar.cc/80?img=1", rating: 5, text: "The best food delivery experience! The biryani was absolutely divine. Fast delivery and still piping hot!", date: "2 days ago" },
  { id: 2, name: "Mike Chen", avatar: "https://i.pravatar.cc/80?img=3", rating: 5, text: "Yasmin Flavors never disappoints. Their burgers are the juiciest in town. The app is so easy to use!", date: "1 week ago" },
  { id: 3, name: "Priya Patel", avatar: "https://i.pravatar.cc/80?img=5", rating: 4, text: "Love the variety! From sushi to biryani, everything tastes authentic. My go-to food ordering app.", date: "3 days ago" },
  { id: 4, name: "David Kim", avatar: "https://i.pravatar.cc/80?img=8", rating: 5, text: "The desserts are incredible! That chocolate lava cake is life-changing. Already ordered it 5 times!", date: "5 days ago" },
];

export const specialOffers = [
  { id: 1, title: "50% OFF First Order", description: "Use code WELCOME50", bgColor: "from-primary to-secondary" },
  { id: 2, title: "Free Delivery", description: "On orders above $25", bgColor: "from-secondary to-primary" },
  { id: 3, title: "Buy 2 Get 1 Free", description: "On all desserts today", bgColor: "from-primary to-secondary" },
];

export const mockOrders: Order[] = [
  { id: "YF-2024-001", items: [], total: 45.97, status: "delivered", date: "2024-01-15", address: "123 Main St" },
  { id: "YF-2024-002", items: [], total: 32.98, status: "out-for-delivery", date: "2024-01-20", address: "456 Oak Ave" },
  { id: "YF-2024-003", items: [], total: 58.96, status: "preparing", date: "2024-01-22", address: "789 Pine Rd" },
];

export const adminStats = {
  totalRevenue: 125430,
  totalOrders: 3247,
  totalUsers: 8920,
  totalItems: 156,
  lowStockItems: 5,
  monthlyRevenue: [
    { month: "Jul", revenue: 8500 },
    { month: "Aug", revenue: 9200 },
    { month: "Sep", revenue: 10800 },
    { month: "Oct", revenue: 11500 },
    { month: "Nov", revenue: 13200 },
    { month: "Dec", revenue: 15800 },
    { month: "Jan", revenue: 14200 },
  ],
  ordersByStatus: [
    { status: "Delivered", count: 2450 },
    { status: "Preparing", count: 320 },
    { status: "In Transit", count: 180 },
    { status: "Cancelled", count: 97 },
  ],
};
