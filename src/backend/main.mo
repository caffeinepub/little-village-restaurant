import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Include Authorization and Blob Storage
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Menu Item Type and Category Enum
  public type MenuCategory = {
    #soupsVeg;
    #soupsNonVeg;
    #startersVeg;
    #startersNonVeg;
    #chineseVeg;
    #chineseNonVeg;
    #andhraCurries;
    #curriesVeg;
    #curriesNonVeg;
    #breads;
    #riceNoodlesVeg;
    #riceNoodlesNonVeg;
    #biryanisVeg;
    #biryanisNonVeg;
    #familyPacksVeg;
    #familyPacksNonVeg;
    #rice;
    #iceCream;
    #beverages;
    #shakes;
    #premiumShakes;
    #mojitosLemonades;
  };

  public type MenuItem = {
    id : Nat;
    name : Text;
    category : MenuCategory;
    price : Nat;
    isVeg : Bool;
    description : Text;
    imageUrl : ?Text;
    isAvailable : Bool;
  };

  // Order Types
  public type OrderItem = {
    itemId : Nat;
    name : Text;
    qty : Nat;
    price : Nat;
  };

  public type OrderStatus = {
    #pending;
    #preparing;
    #ready;
    #delivered;
  };

  public type Order = {
    id : Nat;
    customerName : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
    totalAmount : Nat;
    status : OrderStatus;
    specialInstructions : ?Text;
    createdAt : Int;
  };

  // Reservation Types
  public type ReservationStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  public type Reservation = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    date : Text;
    time : Text;
    guests : Nat;
    specialRequest : ?Text;
    status : ReservationStatus;
    createdAt : Int;
  };

  // Analytics Types
  public type PopularDish = {
    itemId : Nat;
    name : Text;
    orderCount : Nat;
  };

  public type AnalyticsData = {
    totalOrdersToday : Nat;
    totalRevenueToday : Nat;
    popularDishes : [PopularDish];
    totalReservations : Nat;
  };

  // Storage
  let menuItems = Map.empty<Nat, MenuItem>();
  var nextMenuItemId = 1;

  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  let reservations = Map.empty<Nat, Reservation>();
  var nextReservationId = 1;

  // Menu CRUD Operations
  public shared ({ caller }) func addMenuItem(name : Text, category : MenuCategory, price : Nat, isVeg : Bool, description : Text, imageUrl : ?Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };

    let item : MenuItem = {
      id = nextMenuItemId;
      name;
      category;
      price;
      isVeg;
      description;
      imageUrl;
      isAvailable = true;
    };

    menuItems.add(nextMenuItemId, item);
    nextMenuItemId += 1;
    item.id;
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, name : Text, category : MenuCategory, price : Nat, isVeg : Bool, description : Text, imageUrl : ?Text, isAvailable : Bool) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update menu items");
    };

    switch (menuItems.get(id)) {
      case null { false };
      case (?existing) {
        let updated : MenuItem = {
          id;
          name;
          category;
          price;
          isVeg;
          description;
          imageUrl;
          isAvailable;
        };
        menuItems.add(id, updated);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteMenuItem(id : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete menu items");
    };

    switch (menuItems.get(id)) {
      case null { false };
      case (?_) {
        menuItems.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getMenuItem(id : Nat) : async ?MenuItem {
    // Public access - anyone can view menu items
    menuItems.get(id);
  };

  public query ({ caller }) func getAllMenuItems() : async [MenuItem] {
    // Public access - anyone can view menu items
    menuItems.values().toArray();
  };

  // Order Operations
  public shared ({ caller }) func createOrder(customerName : Text, phone : Text, address : Text, items : [OrderItem], totalAmount : Nat, specialInstructions : ?Text) : async Nat {
    // Public access - anyone including guests can create orders
    let order : Order = {
      id = nextOrderId;
      customerName;
      phone;
      address;
      items;
      totalAmount;
      status = #pending;
      specialInstructions;
      createdAt = Time.now();
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order.id;
  };

  public query ({ caller }) func getOrder(id : Nat) : async ?Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view order details");
    };
    orders.get(id);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : OrderStatus) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(id)) {
      case null { false };
      case (?existing) {
        let updated : Order = {
          id = existing.id;
          customerName = existing.customerName;
          phone = existing.phone;
          address = existing.address;
          items = existing.items;
          totalAmount = existing.totalAmount;
          status;
          specialInstructions = existing.specialInstructions;
          createdAt = existing.createdAt;
        };
        orders.add(id, updated);
        true;
      };
    };
  };

  // Reservation Operations
  public shared ({ caller }) func createReservation(name : Text, phone : Text, email : Text, date : Text, time : Text, guests : Nat, specialRequest : ?Text) : async Nat {
    // Public access - anyone including guests can create reservations
    let reservation : Reservation = {
      id = nextReservationId;
      name;
      phone;
      email;
      date;
      time;
      guests;
      specialRequest;
      status = #pending;
      createdAt = Time.now();
    };

    reservations.add(nextReservationId, reservation);
    nextReservationId += 1;
    reservation.id;
  };

  public query ({ caller }) func getReservation(id : Nat) : async ?Reservation {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view reservation details");
    };
    reservations.get(id);
  };

  public query ({ caller }) func getAllReservations() : async [Reservation] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all reservations");
    };
    reservations.values().toArray();
  };

  public shared ({ caller }) func updateReservationStatus(id : Nat, status : ReservationStatus) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update reservation status");
    };

    switch (reservations.get(id)) {
      case null { false };
      case (?existing) {
        let updated : Reservation = {
          id = existing.id;
          name = existing.name;
          phone = existing.phone;
          email = existing.email;
          date = existing.date;
          time = existing.time;
          guests = existing.guests;
          specialRequest = existing.specialRequest;
          status;
          createdAt = existing.createdAt;
        };
        reservations.add(id, updated);
        true;
      };
    };
  };

  // Analytics Operations
  public query ({ caller }) func getAnalytics() : async AnalyticsData {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let now = Time.now();
    let oneDayNanos = 24 * 60 * 60 * 1_000_000_000;
    let startOfDay = now - (now % oneDayNanos);

    var totalOrdersToday = 0;
    var totalRevenueToday = 0;
    let dishCounts = Map.empty<Nat, Nat>();

    for (order in orders.values()) {
      if (order.createdAt >= startOfDay) {
        totalOrdersToday += 1;
        totalRevenueToday += order.totalAmount;

        for (item in order.items.vals()) {
          let currentCount = switch (dishCounts.get(item.itemId)) {
            case null { 0 };
            case (?count) { count };
          };
          dishCounts.add(item.itemId, currentCount + item.qty);
        };
      };
    };

    // Get top 5 popular dishes
    let dishCountsArray = dishCounts.entries().toArray();
    let sortedDishes = dishCountsArray.sort(
      func(a : (Nat, Nat), b : (Nat, Nat)) : { #less; #equal; #greater } {
        if (a.1 > b.1) { #less } else if (a.1 < b.1) { #greater } else { #equal };
      },
    );

    let topDishes = Array.tabulate(
      Nat.min(5, sortedDishes.size()),
      func(i : Nat) : PopularDish {
        let (itemId, count) = sortedDishes[i];
        let itemName = switch (menuItems.get(itemId)) {
          case null { "Unknown" };
          case (?item) { item.name };
        };
        { itemId; name = itemName; orderCount = count };
      },
    );

    {
      totalOrdersToday;
      totalRevenueToday;
      popularDishes = topDishes;
      totalReservations = reservations.size();
    };
  };
};
