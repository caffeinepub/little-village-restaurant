import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PopularDish {
    itemId: bigint;
    name: string;
    orderCount: bigint;
}
export interface OrderItem {
    qty: bigint;
    itemId: bigint;
    name: string;
    price: bigint;
}
export interface Reservation {
    id: bigint;
    status: ReservationStatus;
    date: string;
    name: string;
    createdAt: bigint;
    time: string;
    email: string;
    specialRequest?: string;
    phone: string;
    guests: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    createdAt: bigint;
    specialInstructions?: string;
    totalAmount: bigint;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface MenuItem {
    id: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl?: string;
    category: MenuCategory;
    isVeg: boolean;
    price: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export interface AnalyticsData {
    totalReservations: bigint;
    popularDishes: Array<PopularDish>;
    totalOrdersToday: bigint;
    totalRevenueToday: bigint;
}
export enum MenuCategory {
    breads = "breads",
    familyPacksNonVeg = "familyPacksNonVeg",
    shakes = "shakes",
    curriesNonVeg = "curriesNonVeg",
    curriesVeg = "curriesVeg",
    premiumShakes = "premiumShakes",
    chineseVeg = "chineseVeg",
    startersNonVeg = "startersNonVeg",
    soupsVeg = "soupsVeg",
    rice = "rice",
    riceNoodlesVeg = "riceNoodlesVeg",
    andhraCurries = "andhraCurries",
    biryanisNonVeg = "biryanisNonVeg",
    mojitosLemonades = "mojitosLemonades",
    startersVeg = "startersVeg",
    biryanisVeg = "biryanisVeg",
    beverages = "beverages",
    soupsNonVeg = "soupsNonVeg",
    familyPacksVeg = "familyPacksVeg",
    iceCream = "iceCream",
    riceNoodlesNonVeg = "riceNoodlesNonVeg",
    chineseNonVeg = "chineseNonVeg"
}
export enum OrderStatus {
    preparing = "preparing",
    pending = "pending",
    delivered = "delivered",
    ready = "ready"
}
export enum ReservationStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    addMenuItem(name: string, category: MenuCategory, price: bigint, isVeg: boolean, description: string, imageUrl: string | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(customerName: string, phone: string, address: string, items: Array<OrderItem>, totalAmount: bigint, specialInstructions: string | null): Promise<bigint>;
    createReservation(name: string, phone: string, email: string, date: string, time: string, guests: bigint, specialRequest: string | null): Promise<bigint>;
    deleteMenuItem(id: bigint): Promise<boolean>;
    getAllMenuItems(): Promise<Array<MenuItem>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllReservations(): Promise<Array<Reservation>>;
    getAnalytics(): Promise<AnalyticsData>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMenuItem(id: bigint): Promise<MenuItem | null>;
    getOrder(id: bigint): Promise<Order | null>;
    getReservation(id: bigint): Promise<Reservation | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMenuItem(id: bigint, name: string, category: MenuCategory, price: bigint, isVeg: boolean, description: string, imageUrl: string | null, isAvailable: boolean): Promise<boolean>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<boolean>;
    updateReservationStatus(id: bigint, status: ReservationStatus): Promise<boolean>;
}
